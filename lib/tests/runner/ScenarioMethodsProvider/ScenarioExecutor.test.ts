import {Cucumber} from "../../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {Code} from "../../../browsered-jasmine-cucumber/code/code";
import {ScenarioMethodsProvider} from "../../../browsered-jasmine-cucumber/runner/ScenarioMethodsProvider";
import {executeSpec, executeSteps} from "./spec";

const fn = () => {
};

var cucumber: Cucumber;
var code: Code;
var log: string[];
var lw: (key: string) => () => void;


describe('ScenarioMethodsProvider', () => {

    beforeEach(() => {
        cucumber = new Cucumber();
        code = new Code();
        log = [];
        lw = buildLogger(log);
    });

    it('should search for framing methods', () => {

        cucumber.feature('f', 'g').add(cucumber.steps('s').then('t').use('b'));

        addSteps(code.groupSteps, 'g');
        addSteps(code.featureSteps, 'f');
        addSteps(code.scenarioSteps, 's', 'f');
        addSteps(code.backgroundSteps, 'b');

        const se = new ScenarioMethodsProvider(
            {group: 'g', feature: 'f'},
            cucumber.ctx.featuresGroups['g']['f'].scenarios['s'],
            code.ctx);

        se.getBeforeActions()
            .concat(se.getAfterActions())
            .forEach(a => {
                a()
            });

        expect(log).toEqual([
            "s-before", "f-before", "g-before", "b-before",
            "b-after", "g-after", "f-after", "s-after"]);
    });

    describe('steps method', () => {

        beforeEach(() => {
            executeSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);
            executeSteps(code.backgroundSteps, code.featureSteps,
                code.groupSteps, code.scenarioSteps, lw);
        });

        it('should extract for stand alone scenario with background', () => {

            const se = new ScenarioMethodsProvider(
                {},
                cucumber.ctx.scenarios['stand alone'],
                code.ctx);

            const m = se.getGivenAndSteps();
            m.forEach(x => x.step.fn());

            expect(log).toEqual(['sa.a', 'sa.b', 'sa.c', 'back.d']);
        });

        it('should extract for scenario in feature and group set to feature', () => {
            const se = new ScenarioMethodsProvider(
                {feature: 'f', group: 'g'},
                cucumber.ctx.featuresGroups['g']['f'].scenarios['scenario in feature with group'],
                code.ctx);

            const m = se.getGivenAndSteps();
            m.forEach(x => x.step.fn());

            expect(log).toEqual(['sfg.a', 'sfg.b', 'sfg.c', 'f.a', 'f.c', 'g.b']);
        });

        it('should extract for scenario with background and in feature with group', () => {
            lw('y')();
            expect(log).toEqual(['y']);
        });

        it('should extract then step methods', () => {
            const se = new ScenarioMethodsProvider(
                {feature: 'f', group: 'g'},
                cucumber.ctx.featuresGroups['g']['f'].scenarios['scenario in feature with group'],
                code.ctx);

            const m = se.getThenSteps();
            m.forEach(x => x.step.fn());

            expect(log).toEqual(['sfg.f', 'f.e', 'g.e']);
        });
    });

});

function addSteps(fn, key, key2?) {
    fn(key, key2)
        .before(lw(key + '-before'))
        .after(lw(key + '-after'));
}

function addSteps2(fn, key, step, name, key2?) {
    fn(key, key2)[step](name, lw(`${key2}${key}.${name}`));
}

function buildLogger(log: string[]) {
    return key => {
        return () => {
            log.push(key);
        }
    }
}
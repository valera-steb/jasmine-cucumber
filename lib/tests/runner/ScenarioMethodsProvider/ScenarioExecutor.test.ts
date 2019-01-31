import {Cucumber} from "../../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {Code} from "../../../browsered-jasmine-cucumber/code/code";
import {ScenarioMethodsProvider} from "../../../browsered-jasmine-cucumber/runner/ScenarioMethodsProvider";
import {executeSpec, executeSteps} from "./spec";
import {buildLogger, logFn} from "../../utils";

const fn = () => {
};

var cucumber: Cucumber;
var code: Code;
var log: string[];
var lw: logFn;


describe('ScenarioMethodsProvider', () => {

    beforeEach(() => {
        cucumber = new Cucumber();
        code = new Code();
        log = [];
        lw = buildLogger(log);
    });

    describe('framing methods', () => {

        var smp: ScenarioMethodsProvider;

        beforeEach(() => {
            cucumber.feature('f', 'g').add(cucumber.steps('s').then('t').use('b'));

            addSteps(code.groupSteps, 'g');
            addSteps(code.featureSteps, 'f');
            addSteps(code.scenarioSteps, 's', 'f');
            addSteps(code.backgroundSteps, 'b');

            smp = new ScenarioMethodsProvider(
                {group: 'g', feature: 'f'},
                cucumber.ctx.featuresGroups['g']['f'].scenarios['s'],
                code.ctx);
        });

        it('should search for framing methods', () => {

            smp.getBeforeActions()
                .concat(smp.getAfterActions())
                .forEach(a => {
                    a()
                });

            expect(log).toEqual([
                "b-before", "g-before", "f-before", "s-before",
                "s-after", "f-after", "g-after", "b-after"]);
        });

        it('should reverse before actions by grops', () => {

            addSteps(code.groupSteps, 'g', null, '1');
            addSteps(code.groupSteps, 'g', null, '2');
            addSteps(code.featureSteps, 'f', null, '1');
            addSteps(code.featureSteps, 'f', null, '2');

            const after = smp.getBeforeActions();
            after.forEach(a => {
                a()
            });

            expect(log).toEqual([
                "b-before",
                "g-before", "g.1-before", "g.2-before",
                "f-before", "f.1-before", "f.2-before",
                "s-before"
            ]);
        });
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

        xit('should extract for scenario with background and in feature with group', () => {
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

function addSteps(fn, key, key2?, id?) {
    const prefix = key + (id ? '.' + id : '');
    fn(key, key2)
        .before(lw(`${prefix}-before`))
        .after(lw(`${prefix}-after`));
}

import {Cucumber} from "../../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {Code} from "../../../browsered-jasmine-cucumber/code/code";
import {ScenarioMethodsProvider} from "../../../browsered-jasmine-cucumber/runner/ScenarioMethodsProvider";
import {findStepFn} from "../../../browsered-jasmine-cucumber/runner/domain";

describe('StepSearcher', () => {

    it('should search for step', () => {
        const cucumber = new Cucumber();
        const code = new Code();
        const log = [];

        cucumber.scenario('s')
            .given('g "3"');
        code.scenarioSteps('s')
            .given('g "(.*)"', () => {
                log.push('g');
            })
            .given('m', () => {
                log.push('m');
            });

        const scenario = cucumber.ctx.scenarios['s'];
        const smp = new ScenarioMethodsProvider(
            {},
            scenario,
            code.ctx);

        const r = findStepFn(scenario.steps[0], smp.getGivenAndSteps());
        r.d.step.fn();

        expect(log).toEqual(['g']);
    });
});
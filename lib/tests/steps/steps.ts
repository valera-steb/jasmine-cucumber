import {
    IScenarioStepsFn, IStepsFn
} from "../../browsered-jasmine-cucumber/code/code";

export function executeSteps(backgroundSteps: IStepsFn, featureSteps: IStepsFn,
                             groupSteps: IStepsFn, scenarioSteps: IScenarioStepsFn) {
    featureSteps('вычисления')
        .before(ctx => {
        })
        .after(ctx => {
        })
        .given('g1', ctx => {
        })
        .when('w1', ctx => {
        })
        .then('t1', ctx => {
        });

    scenarioSteps('вычитание с примерами', 'вычисления');

    groupSteps('калькулятор');

    scenarioSteps('отдельно стоящий сценарий');

    backgroundSteps('фон для примеров');
}
import {IScenarioStepsFn, IStepsFn} from "../../browsered-jasmine-cucumber/code/code";

export function executeSteps(backgroundSteps: IStepsFn, featureSteps: IStepsFn,
                             groupSteps: IStepsFn, scenarioSteps: IScenarioStepsFn) {

    groupSteps('featureGroup_01')
        .when('multi when', () => {
        });

    featureSteps('feature_01')
        .given('given', () => {
        })
        .when('when', () => {
        })
        .then('then', () => {
        });

    featureSteps('feature_03')
        .when('multi when', () => {
        });

    scenarioSteps('f01_steps_02', 'feature_01')
        .given('given and', () => {
        });
}
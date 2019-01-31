import {IScenarioStepsFn, IStepsFn} from "../../browsered-jasmine-cucumber/code/code";
import {logFn} from "../utils";

export function executeSteps(backgroundSteps: IStepsFn, featureSteps: IStepsFn,
                             groupSteps: IStepsFn, scenarioSteps: IScenarioStepsFn,
                             lw: logFn) {

    groupSteps('featureGroup_01')
        .when('multi when', lw('fg_01.multi when'))
        .before(lw('fg_01.before'))
        .after(lw('fg_01.after'));

    featureSteps('feature_01')
        .before(lw('fg_01_f_01.before'))
        .after(lw('fg_01_f_01.after'))
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
        .before(lw('fg01_s02.before'))
        .after(lw('fg01_s02.after'))
        .given('given and', () => {
        });
}
import {IExclude, IFeatureFn, IScenarioFn, IStepsFn} from "../../../browsered-jasmine-cucumber/cucumber/Cucumber";
import * as code from "../../../browsered-jasmine-cucumber/code/code";
import {logFn} from "../../utils";

const fn = () => {
};


export function executeSpec(feature: IFeatureFn, steps: IStepsFn, scenario: IScenarioFn, x: IExclude) {

    scenario('stand alone')
        .given('a')
        .and('b')
        .when('c')
        .and('d')
        .then('e')
        .and('f')
        .use('back');


    feature('f', 'g')
        .add(steps('scenario in feature with group')
            .then('then')
        );

    feature('f')
        .add(steps('s')
            .then('then'));
}

export function executeSteps(backgroundSteps: code.IStepsFn, featureSteps: code.IStepsFn,
                             groupSteps: code.IStepsFn, scenarioSteps: code.IScenarioStepsFn,
                             lw: logFn) {

    scenarioSteps('stand alone')
        .given('a', lw('sa.a'))
        .given('b', lw('sa.b'))
        .when('c', lw('sa.c'))
        .then('f', lw('sa.f'));

    backgroundSteps('back')
        .when('d', lw('back.d'))
        .then('e', lw('back.e'));


    scenarioSteps('scenario in feature with group', 'f')
        .given('a', lw('sfg.a'))
        .given('b', lw('sfg.b'))
        .when('c', lw('sfg.c'))
        .then('f', lw('sfg.f'));

    featureSteps('f')
        .given('a', lw('f.a'))
        .when('c', lw('f.c'))
        .then('e', lw('f.e'));

    groupSteps('g')
        .given('b', lw('g.b'))
        .then('e', lw('g.e'));
}
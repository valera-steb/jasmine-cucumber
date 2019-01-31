import {
    IFeatureFn,
    IScenarioFn,
    IStepsFn,
    IExclude
} from '../../browsered-jasmine-cucumber/cucumber/Cucumber';

export function executeFullSpec(feature: IFeatureFn, steps: IStepsFn, scenario: IScenarioFn, x: IExclude) {

    feature('feature_01', 'featureGroup_01')
        .add(steps('f01_steps_01')
            .given('given')
            .when('when')
            .then('then')
        )
        .add(steps('f01_steps_02')
            .given('given')
            .and('given and')
            .then('then')
        )
        .add(steps('f01_steps_03')
            .when('when')
            .and('when and')
            .then('then')
        )
        .add(steps('f01_steps_04')
            .then('then')
            .and('then and')
        )
        .add(steps('f01_steps_05')
            .given('given')
            .and('given and')
            .and('given and')
            .when('when')
            .then('then')
            .and('then and')
        );

    feature('feature_02', 'featureGroup_01')
        .add(steps('f02_steps_01')
            .x.when('when')
            .and('when and')
            .then('then')
        )
        .add(steps('f02_steps_02')
            .when('when')
            .x.and('when and')
            .and('when and')
            .then('then')
        )
        .add(steps('f02_steps_03')
            .when('when')
            .x.then('then')
            .and('then and')
        )
        .add(steps('f02_steps_04')
            .when('when')
            .then('then')
            .x.and('then and')
            .and('then and')
        );

    feature('feature_03', 'featureGroup_01')
        .add(steps('f03_steps_01')
            .when('multi when')
            .and('multi when').fromFeature()
            .and('multi when').fromGroup()
            .and('multi when').fromBackground()
            .use('multi when background')
        );

    feature('feature_04')
        .add(steps('f04_steps_01')
            .when('multi when')
            .and('multi when').fromFeature()
            .and('multi when').fromGroup()
            .and('multi when').fromBackground()
        )
        .add(steps('f04_steps_02')
            .when('multi when')
            .and('multi when').fromFeature()
            .and('multi when').fromGroup()
            .and('multi when').fromBackground()
            .use('multi when background')
        );


    scenario('scenario_01', 'featureGroup_01');

    scenario('scenario_02');
}
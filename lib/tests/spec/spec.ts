import {
    IFeatureFn,
    IScenarioFn,
    IStepsFn,
    IExclude
} from '../../browsered-jasmine-cucumber/cucumber/Cucumber';

export function executeSpec(feature: IFeatureFn, steps: IStepsFn, scenario: IScenarioFn, x: IExclude) {
    feature('вычисления')
        .add(steps('сложение')
            .when('Я ввожу "1"')
            .and('Выбираю "+"')
            .and('Я ввожу "2"')
            .and('Выбираю "="')
            .then('На экране "3"'))

        .x.add(steps('секция не будет выполнена - добавлена как xdescribe')
            .given('какой-то объект', {some: 'object'})
            .when('что-то сделаю')
            .then('что-то произойдёт с объектом', ['no', 'data'])
        )

        .add(steps('вычитание с примерами')
            .when('Я ввожу "{a}"')
            .and('Выбираю "-"')
            .and('Я ввожу "{b}"')
            .and('Выбираю "="')
            .then('На экране "{s}"').fromBackground()
            .use('фон для примеров')
            .examples([
                {a: 1, b: 2, s: -1},
                {a: 5, b: 2, s: 3}
            ])
        );


    feature('сложные вычисления', 'калькулятор')
        .add(steps('шаги с пропуском')
            .when('Я ввожу "1"')
            .and('Выбираю "+"')
            .x.and('Выбираю "-"', 'который будет пропущен').fromGroup()
            .x.and('Выбираю "-"', 'который будет пропущен').fromFeature()
            .and('Выбираю "="')
            .then('На экране "2"')
        );


    scenario('отдельно стоящий сценарий');


    scenario(
        'отдельно стоящий сценарий, так-же может быть в группе',
        'калькулятор');

    x.feature('отключенное описание функционала');

    x.scenario('отключенный отдельно стоящий сценарий');
}
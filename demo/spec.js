/**
 * Created by steb on 18.02.2015.
 */

feature('add', 'Calculator')
    .add(scenario('should be able to add 2 numbers together')
        .when('I enter "1"')
        .and('I add "2"')
        .then('I should get "3"'))

    .add(scenario('should be able to add to a result of a previous addition')
        .given('I added "1" and "2"')
        .when('I add "3"')
        .then('I should get "6"'))

    .add(scenario('should be able to add asynchronously')
        .when('I eventually add "1" and "2"')
        .then('I should get "3"'));


/*
feature('Contexts', 'bjc')
    .add(scenario('Use steps from feature')
        .given('Array', [1, 2, 3])
        .when('Pop item')
        .then('Has array', [1, 2]))

    .add(scenario('Use steps from background')
        .given('Object', {x:1, y:2})
        .when('Remove item "x"')
        .then('Object.x', undefined))

    .add(scenario('Use steps from group'))

    .add(scenario('Use steps priority'));
*/


feature('Examples', 'bjc')
    .add(scenario('Repeat for each example'))

    .add(scenario('Example table with object'));


feature('Grouping', 'bjc')
    .add(scenario('Same feature name in group and without it'))

    .add(scenario('Same feature name in different groups'));
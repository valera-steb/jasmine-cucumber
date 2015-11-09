/**
 * Created by steb on 18.02.2015.
 */

feature('add', 'Calculator')
    .add(steps('should be able to add 2 numbers together')
        .when('I enter "1"')
        .and('I add "2"')
        .then('I should get "3"'))

    .add(steps('should be able to add to a result of a previous addition')
        .given('I added "1" and "2"')
        .when('I add "3"')
        .then('I should get "6"'))

    .add(steps('should be able to add asynchronously')
        .when('I eventually add "1" and "2"')
        .then('I should get "3"'));


/*
 feature('Contexts', 'bjc')
 .add(steps('Use steps from feature')
 .given('Array', [1, 2, 3])
 .when('Pop item')
 .then('Has array', [1, 2]))

 .add(steps('Use steps from background')
 .given('Object', {x:1, y:2})
 .when('Remove item "x"')
 .then('Object.x', undefined))

 .add(steps('Use steps from group'))

 .add(steps('Use steps priority'));
 */


feature('Examples', 'bjc')
    .add(steps('Repeat for each example'))

    .add(steps('Example table with object'));


feature('Grouping', 'bjc')
    .add(steps('Same feature name in group and without it'))

    .add(steps('Same feature name in different groups'));


scenario('отдельно стоящий сценарий')
    .add(steps('name_1')
        .given('что-то')
        .when('что-то')
        .then('что-то'))
    .add(steps('name_2')
        .when()
        .then())
    .add(steps('name_3')
        .when()
        .then())
    .addGraph([
        ['init',
            ['p1', 'name_1'],
            ['p1', 'name_2']],
        ['p1',
            ['p2', 'name_1'],
            ['end', 'name_3']],
        ['p2',
            ['end', 'name_2']]
    ]);

/**
 * Created by steb on 15.02.2015.
 */
feature('Обычные объявления')
    .add(scenario('scenario 1 name')
        .given('x')
        .when('y')
        .then('z')
)
    .add(scenario('scenario 2 name')
        .given('x')
        .and('x1')
        .when('y')
        .and('y1')
        .then('z')
        .and('z1')
);

/*
 feature('feature with example')
 .add(scenario('scenario with different data')
 .given('I have <first> number')
 .when('I add <second> number')
 .then('I have <third> number'))
 .with(examples(['first', 'second', 'third'])
 .add('first group name', [1, 2, 3])
 .add('second group name', [2, 3, 5])
 .add('third group name', [20, 1, 21])
 );
 */

feature('this feature is in group', 'group name')
    .add(scenario('this scenario use steps from group')
        .given('x')
        .when('y')
        .then('z')
)
    .add(scenario('this scenario use custom steps from background (all in back)')
        .given('x')
        .when('y')
        .then('z'))
    .use('background name'
)
    .add(scenario('this scenario use steps from feature and group')
        .given('f1')
        .when('y')
        .then('_f2')
)
    .add(scenario('use steps modifier')
        .given('f1')
        .when('f2').fromBackground()
        .then('f3').fromGroup())
    .use('back2'
);


/*
 дополнительно:
 .features из разных файлов но в одной группе - собираю в однин
 describe jasmine

 .каждый шаг - отдельный it.
 + given и when - опционально могут прописать expect.
 + then - обязан вызвать expect - либо будет
 висеть в jasmine предупреждение

 .фича с примерами - повторяеться в итоговом тесте с
 добавленным именем ряда

 .в название Scenario с background-ом добавляеться [background name]

 .ещё-бы название шагов разделить. Хотя-бы на given|when  и then.

 фактор:
 .beforeAll и beforeEach не получаеться использовать напрямую.
 + хотелось бы иметь возможность указать
 .- что делать перед/после каждым сценарием
 .- что делать перед/после каждей фичей

 .т.к. каждый сценарий обёрнут в свой define,
 то для сценария можно использовать beforeAll/afterAll


 фактор:
 .асинхронное/паралельное выполнение шагов в given|when|then
 .а оно мне надо?
 .думаю нет, т.е. и не следует его трогать.
 */

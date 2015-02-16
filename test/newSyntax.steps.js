/**
 * Created by steb on 15.02.2015.
 */
featureSteps('Обычные объявления')
    .before(function () {
        console.log('Обычные объявления: before');
    })
    .after(function () {
        console.log('Обычные объявления: after');
    })
    .given('x', function () {

    })
    .given('x1', function () {

    })
    .when('y', function () {

    })
    .when('y1', function () {

    })
    .then('z', function () {
        expect(true).toBeTruthy();
    })
    .then('z1', function () {
        expect(true).toBeTruthy();
    });

featureSteps('this feature is in group')
    .given('x', function () {

    })
    .given('f1', function () {

    })
    .when('y', function () {

    })
    .when('f2', function () {

    })
    .then('z', function () {
        expect(true).toBeTruthy();
    })
    .then('_f2', function () {
        expect(true).toBeTruthy();
    })
    .then('f3', function () {
        expect(true).toBeTruthy();
    });

//groupSteps('name');

//backgroundSteps('name');

/*
 при этом:
 .в начале идёт вызовы:
 .before группы, потом фона, потом фичи.
 .after фичи, фона, группы.
 .методы ищем в порядке:
 .фичи, фона, группы.
 .у методов могут быть пометки - откуда брать: фон/группа.
 */
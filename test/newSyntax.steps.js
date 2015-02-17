/**
 * Created by steb on 15.02.2015.
 */
featureSteps('Обычные объявления')
    .before(function (ctx) {
/*        var done = ctx.async();
        setTimeout(done, 2000);*/
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
    .before(function (ctx) {
        /*        var done = ctx.async();
         setTimeout(done, 2000);*/
        console.log('this feature is in group: before');
    })
    .after(function () {
        console.log('this feature is in group: after');
    })
    .given('x', function () {
        /*var done = this.async();
        setTimeout(done, 2000);*/
    })
    .given('multi1', function () {
        this.funct = true;
    })
    .when('y', function () {

    })
    .when('f2', function () {

    })
    .when('multi2', function () {
        expect(true).toBeFalsy();
    })
    .then('z', function () {
        expect(true).toBeTruthy();
    })
    .then('f3', function () {
        expect(true).toBeTruthy();
    })
    .then('multi3', function () {
        expect(true).toBeFalsy();
    });

groupSteps('group name')
    .before(function(){
        console.log('group name: before');
    })
    .after(function(){
        console.log('group name: after');
    })
    .given('multi1', function () {
        expect(true).toBeFalsy();
    })
    .given('f1', function () {

    })
    .when('multi2', function () {
        expect(true).toBeFalsy();
    })
    .then('_f2', function () {
        expect(true).toBeTruthy();
    })
    .then('multi3', function () {
        expect(this.funct).toBeTruthy();
        expect(this.back).toBeTruthy();
    });

backgroundSteps('custom all in back')
    .before(function(){
        console.log('custom (all in back): before');
    })
    .after(function(){
        console.log('custom (all in back): after');
    })
    .given('xg', function () {

    })
    .when('yg', function () {

    })
    .then('zg', function () {
        expect(true).toBeTruthy();
    });

backgroundSteps('back2')
    .given('multi1', function () {
        expect(true).toBeFalsy();
    })
    .when('multi2', function () {
        this.back = true;
    })
    .then('multi3', function () {
        expect(true).toBeFalsy();
    });

/*
 при этом:
 .в начале идёт вызовы:
 .before группы, потом фона, потом фичи.
 .after фичи, фона, группы.
 .методы ищем в порядке:
 .фичи, фона, группы.
 .у методов могут быть пометки - откуда брать: фон/группа.
 */
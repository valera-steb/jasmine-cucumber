/**
 * Created by steb on 17.02.2015.
 *
 * факторы:
 * .вызываеться it-ом jasmin-а
 * .во время вызова должен получить step из ScenarioExecuter по stepSpec
 * ..stepSpec - описание given/when/then из scenarioSpec - вводим в спецификации
 *
 * получает:
 * .stepSpec
 * .scenarioContext - объект передаваемый всем шагам сценария
 * .getStep - выдаёт функцию данного шага из *.steps.js - stepDescription по stepSpec
 */
define([

], function () {
    return function StepExecuter(stepSpec, scenarioContext, getStep) {
        var
            stepExecutor = this;

        stepExecutor.description = stepSpec.fullDescription;

        stepExecutor.step = function (done) {
            // т.е. выполняеться только по запросу it-ом
            var
                step = getStep(stepSpec, scenarioContext),
                asyncContext = getAsyncForStep(done);

            scenarioContext.async = asyncContext.async;
            step();
            asyncContext.done();
        };


        return this;


        function getAsyncForStep(done) {
            var called = false;

            return {
                async: function () {
                    called = true;
                    return done;
                },
                done: function () {
                    if (called) return;
                    done();
                }
            }
        }
    }
});
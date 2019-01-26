/**
 * Created by steb on 17.02.2015.
 */
define([

], function () {
    function AsyncExecuter(steps, scenarioContext) {
        // запускает шаги один за другим
        // если один из шагов запрашивает асинхронное выполнение (продолжение по коллбэку)
        // запуск цепочки прерываеться на запросившем
        // и продолжаеться по коллбэку - который говорит, что асинхронная опирация завершилась
        var
            currentStep = -1,
            isAsync = false,
            executingStep = false,
            context = {
                async: function () {
                    isAsync = true;
                    return function () {
                        // хитрая валидация на кривые руки клиента: если step в себе сохранил
                        // контекст и в отдельном потоке постарался вызвать async
                        // и после завершить, в то время, как остальной код выполнялся.
                        // правда она не обязательно спасает от неправильного doneCallback
                        if (executingStep) {
                            isAsync = false;
                        }
                        else {
                            executeNextStep();
                        }
                    };
                }
            },
            doneCallback;

        function executeNextStep() {
            isAsync = false;

            // if there is a next step
            if (currentStep + 1 < steps.length) {
                currentStep++;

                executingStep = true;
                steps[currentStep].call(scenarioContext, context);
                executingStep = false;

                if (!isAsync) {
                    executeNextStep();
                }
            }
            else {
                doneCallback();
            }
        };

        return function run(done) {
            doneCallback = done;
            executeNextStep();
        };
    };


    AsyncExecuter.makeFramingActions = function (position, relevantSteps) {
        return function (featureContext) {
            var framingSteps = relevantSteps.reduce(function (reduce, item) {
                return reduce.concat(item[position]);
            }, []);

            return framingSteps.length > 0
                ? AsyncExecuter(framingSteps, featureContext)
                : nop;
        };
    };


    return AsyncExecuter;


    function nop() {
    }
});

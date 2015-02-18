/**
 * Created by steb on 17.02.2015.
 *
 * задача:
 * .получить методы обрамления фичи
 * .получить набор сценариев для запуска
 *
 * получает:
 * .featureSpec - спецификацию текущей фичи.
 * .featuresDescriptions - описание всех фич.
 *
 * время жизни - выполнение текущей фичи.
 */
define([
    'browsered-jasmine-cucumber/Runner/AsyncExecuter'
], function (AsyncExecuter) {
    return function FeatureRunner(featureSpec, featuresDescriptions) {
        var
            featureRunner = this,
            relevantFeatureSteps = featuresDescriptions.filter(function (item) {
                return item.pattern.test(featureSpec.description);
            });


        featureRunner.getFramingActions = function () {
            return {
                before: AsyncExecuter.makeFramingActions(
                    'beforeSteps',
                    relevantFeatureSteps
                ),
                after: AsyncExecuter.makeFramingActions(
                    'afterSteps',
                    relevantFeatureSteps
                )
            };
        };

        featureRunner.getSteps = function(){
            return relevantFeatureSteps;
        };

        featureRunner.getActiveScenarios = function () {
            // фильтруем сценарии not|only
            var scenarios = featureSpec.scenarios.filter(function (item) {
                return item.isOnly;
            });

            // if we have no scenarios to run specifically (isOnly) then run them all
            if (scenarios.length === 0) {
                // then run them all
                scenarios = featureSpec.scenarios.filter(function (item) {
                    return !item.never;
                });
            }
            return scenarios;
        };

        return this;
    };
});

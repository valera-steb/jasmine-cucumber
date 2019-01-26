/**
 * Created by steb on 17.02.2015.
 *
 * получает:
 * .спецификацию сценария - scenarioSpec
 * ..given/when/then
 * ..use(background)
 *
 * .шаги по слоям - FeatureSteps - для group, feature
 * ..after/before
 * ..given/when/then('matcher', function(){})
 *
 * .ссылку на контейнер фонов - FeatureSteps внутри
 *
 * живёт в течении выполнения фичи, при выполнении следующей - создаю новый
 *
 * задачи:
 * .создать вызовы обрамляющих действий
 * ..по имени фона в scenarioSpec, найти в контейнере фонов все фоны и выдернуть у них действия обрамления
 * ..обернуть выдернутые действия в AsyncExecuter
 *
 * .создать для данного scenarioSpec массив с вызовами шагов сценария
 * ..найти шаги из уровней
 */
define([
    './AsyncExecuter',
    './StepExecuter',
    './SpecStepsSearcher'
], function (AsyncExecuter, StepExecuter, SpecStepsSearcher) {
    return function ScenarioExecuter(backgroundStepDescriptions) {
        var
            _scenario, _stepsLayers,
            relevantScenarioSteps;

        return {
            setUp: function (scenario, stepsBuilder) {
                relevantScenarioSteps = backgroundStepDescriptions
                    .filter(function (item) {
                        return item.pattern.test(scenario.background);
                    }
                );

                _scenario = scenario, _stepsLayers = stepsBuilder(relevantScenarioSteps);

                scenario.fullDescription = scenario.description + (scenario.background
                    ? ' (bg:' + scenario.background + ')'
                    : '');
            },

            getFramingActions: function () {
                return {
                    before: AsyncExecuter.makeFramingActions(
                        'beforeSteps',
                        relevantScenarioSteps
                    ),
                    after: AsyncExecuter.makeFramingActions(
                        'afterSteps',
                        relevantScenarioSteps
                    )
                };
            },

            getSteps: function (scenarioContext) {
                var search = new SpecStepsSearcher(_scenario, _stepsLayers);

                return _scenario.steps.map(function (stepSpec) {
                    return new StepExecuter(
                        stepSpec, scenarioContext, search
                    );
                });
            }
        };
    };
});
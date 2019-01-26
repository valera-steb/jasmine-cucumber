/**
 * получает:
 * .featureSpecGroups - фичи по группам.
 * .stepDescriptionLayers - выполняемые описания по слоям (feature, background, group)
 *
 * задача:
 * .для данной группы выполнить все фичи в ней
 */
define([
    './FeatureRunner',
    './ScenarioExecuter',
    './AsyncExecuter',
    './utils'
], function (FeatureRunner, ScenarioExecuter, AsyncExecuter, utils) {
    return function GroupAdapter(featureSpecGroups, stepDescriptionLayers) {
        return function (group) {
            groupRunner(group, featureSpecGroups, stepDescriptionLayers);
        };
    };

    function groupRunner(group, featureSpecGroups, stepDescriptionLayers) {
        var
            groupFraming, addFeatureSteps;

        group != 'undefined'
            ? describe(group, groupRunner)
            : groupRunner();


        function featureRunner(featureSpec) {
            var
                featureRunner = FeatureRunner(
                    featureSpec, utils.extract(
                        stepDescriptionLayers, 'featureSteps', [])
                ),
                featureFraming = featureRunner.getFramingActions(),
                scenarioExecuter = ScenarioExecuter(
                    utils.extract(stepDescriptionLayers, 'backgroundSteps' , [])
                ),
                addScenarioSteps = addFeatureSteps(featureRunner.getSteps());

            describe(featureSpec.description, function () {
                featureRunner.getActiveScenarios().forEach(function (scenario) {
                    var
                        scenarioFraming, scenarioContext = {};

                    scenarioExecuter.setUp(scenario, addScenarioSteps, scenarioContext);
                    scenarioFraming = scenarioExecuter.getFramingActions();

                    describe(scenario.fullDescription, function () {
                        beforeAll(groupFraming.before(scenarioContext));
                        beforeAll(scenarioFraming.before(scenarioContext));
                        beforeAll(featureFraming.before(scenarioContext));

                        scenarioExecuter.getSteps(scenarioContext).forEach(function (step) {

                            it(step.description, step.step);

                        });

                        afterAll(featureFraming.after(scenarioContext));
                        afterAll(scenarioFraming.after(scenarioContext));
                        afterAll(groupFraming.after(scenarioContext));
                    });
                });
            });
        }


        function groupRunner() {
            var actions = utils.extract(
                stepDescriptionLayers, 'groupSteps', []
            ).filter(function (item) {
                    return item.pattern.test(group);
                });

            groupFraming = {
                before: AsyncExecuter.makeFramingActions(
                    'beforeSteps', actions
                ),
                after: AsyncExecuter.makeFramingActions(
                    'afterSteps', actions
                )};

            addFeatureSteps = resolveGroup(actions);

            featureSpecGroups[group].forEach(featureRunner);
        }


        function nop() {
        }
    }

    function resolveGroup(groupSteps) {
        return function resolveFeature(featureSteps) {
            return function makeLayersArray(backgroundSteps) {
                // нужно сформировать массивы из specSteps в которых производить поиск
                // при этом, нужно отфильтровать
                // steps текущей гуппы, steps текущего фона, steps текущей фичи
                return [
                    {
                        key: undefined,
                        steps: extractSteps(featureSteps)
                    },
                    {
                        key: 'background',
                        steps: extractSteps(backgroundSteps)
                    },
                    {
                        key: 'group',
                        steps: extractSteps(groupSteps)
                    }
                ]
            }
        };

        function extractSteps(item) {
            if (!item)
                return [];

            return item.reduce(function (r, i) {
                return r.concat(i.steps);
            }, []);
        }
    }
});

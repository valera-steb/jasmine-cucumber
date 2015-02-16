(function () {
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(matrix[i][j - 1] + 1, // insertion
                                matrix[i - 1][j] + 1)); // deletion
                }
            }
        }

        return matrix[b.length][a.length];
    }


    function jasmineFeatureRunner(feature, steps, features) {
        (function () {
            getFeaturesSteps();

            var
                scenarios = getActiveScenarios();

            describe('\nFeature: ' + feature.description, function () {
                scenarios.forEach(function (scenario) {
                    var
                        scenarioExecuter = ScenarioExecuter(feature.steps, features),
                        steps = scenarioExecuter.correlateStepsFor(scenario),
                        beforeRunner = AsyncExecuter(feature.beforeSteps),
                        afterRunner = AsyncExecuter(feature.afterSteps);

                    // как подсунуть проверку пропущенных шагов в последний ит?
                    describe('\nScenario: ' + scenario.description + '\n', function () {
                        beforeAll(beforeRunner);

                        steps.forEach(function (step) {
                            it(step.description, step.step);
                        });

                        console.log(steps);
                        afterAll(afterRunner);
                    });
                });
            })
        })();

        function getFeaturesSteps() {
            // выбираем featureSteps с подходящими именами
            var relevantFeatureSteps = steps.filter(function (item) {
                return item.pattern.test(feature.description);
            });


            // из всех featureSteps собираем steps в один массив
            feature.steps = relevantFeatureSteps.reduce(function (reduce, item) {
                return reduce.concat(item.steps);
            }, []);


            // собираем пред и пост методы
            feature.beforeSteps = relevantFeatureSteps.reduce(function (reduce, item) {
                //TODO: добавить метод группы и контекста
                return reduce.concat(item.beforeSteps);
            }, []);
            feature.afterSteps = relevantFeatureSteps.reduce(function (reduce, item) {
                //TODO: добавить метод группы и контекста
                return reduce.concat(item.afterSteps);
            }, []);
        };

        function getActiveScenarios() {
            // фильтруем сценарии not|only
            var scenarios = feature.scenarios.filter(function (item) {
                return item.isOnly;
            });
            // if we have no scenarios to run specifically (isOnly) then run them all
            if (scenarios.length === 0) {
                // then run them all
                scenarios = feature.scenarios.filter(function (item) {
                    return !item.never;
                });
            }
            return scenarios;
        }
    }

    function adapter(features, steps) {
        return function (feature) {
            return jasmineFeatureRunner(feature, steps, features);
        };
    }

    function groupAdapter(grooups, steps) {
        return function (groupId) {
            if (groupId != 'undefined')
                describe(groupId, renderGroup);
            else renderGroup();

            function renderGroup() {
                var groupFeatures = grooups[groupId],
                    runner = adapter(groupFeatures, steps);

                groupFeatures.forEach(runner);
            };
        }
    }

    if (typeof window !== 'undefined') {
        window.jasmineFeatureRunner = adapter;
        window.jasmineGroupRunner = groupAdapter;
    }
    else if (typeof module !== 'undefined') {
        module.exports = adapter;
    }


    //---------------------------------
    // domain types
    function ScenarioExecuter(stepsDefinitions, features) {
        var
            missingSteps = [],
            ambiguousSteps = [];

        return {
            correlateStepsFor: function (scenario) {
                return scenario.steps.map(function (scenarioStep) {
                    return {
                        // TODO: givens could come after thens - but they are currently bucketed in a way
                        //  where givens are grouped together
                        description: scenarioStep.fullDescription,

                        step: function () {
                            // т.е. выполняеться только по запросу it-ом
                            var step = getStep(scenarioStep);

                            if (step && missingSteps.length === 0 && ambiguousSteps.length === 0) {
                                step();
                            }
                        }
                    };
                })
            }
        };

        function getStep(description) {
            // look for 1 and only one match step
            var matchingSteps = stepsDefinitions
                .map(function (item) {
                    var result = item.pattern.exec(description.description);
                    return {
                        definition: item.definition,
                        pattern: item.pattern,
                        arguments: result ? result.slice(1).concat(description.arguments) : [],
                        match: !!result
                    };
                })
                .filter(function (item) {
                    return item.match;
                });

            if (matchingSteps.length === 0) {
                missingSteps.push(description.description);
                throw new Error('Missing step definitions:\n\t' + stepWithLikelyMatch(description.description));
            }
            else if (matchingSteps.length > 1) {
                ambiguousSteps.push(description.description);
                console.warn(description.description, ' has few matches');
            }

            if (matchingSteps.length === 1) {
                return function (scenarioContext) {
                    // TODO: ideally we could be detecting failed jasmine matcher so that we can include this description
                    //  as the step that failed. But that is proving to be very difficult requiring custom matchers...
                    if (description.keyword != 'Then')
                        expect(call).not.toThrow();
                    else
                        call();

                    function call() {
                        matchingSteps[0].definition.apply(scenarioContext, matchingSteps[0].arguments);
                    }
                };
            }
            else {
                return noOp;
            }
        }

        function noOp() {
        }


        function mapDescription(step) {
            return step.description;
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        function stepWithLikelyMatch(unknownDescription) {
            var candidates = features.reduce(function (memo, feature) {
                return memo.concat(feature.scenarios);
            }, [])
                .reduce(function (memo, scenario) {
                    return memo.concat(scenario.steps.map(mapDescription));
                }, [])
                .map(function (item) {
                    return item;
                })
                .filter(onlyUnique)
                .filter(function (description) {
                    return missingSteps.indexOf(description) === -1;
                })
                .map(function (knownDescription) {
                    return {
                        description: knownDescription,
                        score: levenshteinDistance(unknownDescription, knownDescription)
                    };
                })
                .sort(function (l, r) {
                    return l.score - r.score;
                })
                .map(function (item) {
                    return item.description + ' (' + item.score + ')';
                })
                .slice(0, 5);
            return unknownDescription + '\n\t\tDid you mean?\n\t\t\t' + candidates.join('\n\t\t\t');
        }
    }

    function AsyncExecuter(steps) {
        // запускает шаги один за другим
        // если один из шагов запрашивает асинхронное выполнение (продолжение по коллбэку)
        // запуск цепочки прерываеться на запросившем
        // и продолжаеться по коллбэку - который говорит, что асинхронная опирация завершилась
        var
            currentStep = -1,
            isAsync = false,
            executingStep = false,
            scenarioContext = {
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
                steps[currentStep](scenarioContext);
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
})
();
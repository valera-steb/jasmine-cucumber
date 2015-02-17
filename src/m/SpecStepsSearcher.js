/**
 * Created by steb on 17.02.2015.
 *
 * фактор:
 * .есть несколько уровней: [группы, фона, фичи]
 * .есть приоритет сопоставления - в начале фичи, потом фона, потом группы.
 * .есть модификаторы приоритета - начинать откуда либо до какого уровня пропускать
 *
 * задача:
 * .поискать в каждой группе (учитывая приоритет и пропуск)
 * .если на уровне нашлись несколько - вернуть действие с ошибкой и вопросом какой
 * .если ни один не нашёлся - сгенерить массив близких по всем искомым и спросить - какой?
 *
 * получает:
 * .список: имя уровня, stepsDescriptions
 * .scenarioSpec
 *
 * время жизни - один сценарий, т.к. у следующего будет другой список уровней.
 */
define([

], function () {
    return function SpecStepsSearcher(scenarioSpec, stepsLevels) {

        return function getStep(description, scenarioContext) {
            var
                isSearching = false,
                levelNum = -1,
                stepsDefinitions = [];

            function search() {
                levelNum++;
                if (levelNum >= stepsLevels.length)
                    return function () {
                        throw new Error('Missing step definitions: ' +
                            stepWithLikelyMatch(description.description, stepsDefinitions));
                    };

                var level = stepsLevels[levelNum];
                isSearching = isSearching || description.level === level.key;
                if (!isSearching)
                    return search();

                var found = getStepForLayer(description, level.steps, scenarioContext);
                if (found.action) {
                    return found.action;
                }
                if (found.length > 1)
                    return function () {
                        throw new Error('Had few matches: ' + found.steps
                                .map(mapDescription)
                                .join('\n\t')
                        )
                    };

                stepsDefinitions = level.steps.reduce(reduceItem, stepsDefinitions);
                return search();
            }

            return search();

            function reduceItem(reduce, item) {
                return reduce.concat(item);
            }
        };

        function getStepForLayer(description, stepsDefinitions, scenarioContext) {
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


            if (matchingSteps.length !== 1)
                return {
                    length: matchingSteps.length,
                    steps: matchingSteps
                };

            return {action: function () {
                // TODO: ideally we could be detecting failed jasmine matcher so that we can include this description
                //  as the step that failed. But that is proving to be very difficult requiring custom matchers...
                if (description.keyword != 'Then')
                    expect(true).toBeTruthy();

                matchingSteps[0].definition.apply(scenarioContext, matchingSteps[0].arguments);
            }};
        }
    };


    function stepWithLikelyMatch(unknownDescription, stepsDefinitions) {
        console.log(stepsDefinitions);

        var candidates = stepsDefinitions.reduce(function (memo, step) {
            return memo.concat(step.name);
        }, [])
            .map(function (item) {
                return item;
            })
            .filter(onlyUnique)
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

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function mapDescription(step) {
        return step.description;
    }


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
});
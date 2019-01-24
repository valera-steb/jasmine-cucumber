(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("browsered-jasmine-cucumber", [], factory);
	else if(typeof exports === 'object')
		exports["browsered-jasmine-cucumber"] = factory();
	else
		root["browsered-jasmine-cucumber"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./browsered-jasmine-cucumber.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./browsered-jasmine-cucumber.js":
/*!***************************************!*\
  !*** ./browsered-jasmine-cucumber.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by steb on 18.02.2015.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! browsered-jasmine-cucumber/core */ "./browsered-jasmine-cucumber/core.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/cucumber */ "./browsered-jasmine-cucumber/cucumber.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/GroupsRunner */ "./browsered-jasmine-cucumber/Runner/GroupsRunner.js")
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(bjc, c, GroupsRunner){
    window.GroupsRunner = bjc.GroupsRunner = GroupsRunner;

    return bjc;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/AsyncExecuter.js":
/*!************************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/AsyncExecuter.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by steb on 17.02.2015.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/FeatureRunner.js":
/*!************************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/FeatureRunner.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/AsyncExecuter */ "./browsered-jasmine-cucumber/Runner/AsyncExecuter.js")
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (AsyncExecuter) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/GroupsRunner.js":
/*!***********************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/GroupsRunner.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * получает:
 * .featureSpecGroups - фичи по группам.
 * .stepDescriptionLayers - выполняемые описания по слоям (feature, background, group)
 *
 * задача:
 * .для данной группы выполнить все фичи в ней
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/FeatureRunner */ "./browsered-jasmine-cucumber/Runner/FeatureRunner.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/ScenarioExecuter */ "./browsered-jasmine-cucumber/Runner/ScenarioExecuter.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/AsyncExecuter */ "./browsered-jasmine-cucumber/Runner/AsyncExecuter.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/utils */ "./browsered-jasmine-cucumber/Runner/utils.js")
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (FeatureRunner, ScenarioExecuter, AsyncExecuter, utils) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/ScenarioExecuter.js":
/*!***************************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/ScenarioExecuter.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/AsyncExecuter */ "./browsered-jasmine-cucumber/Runner/AsyncExecuter.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/StepExecuter */ "./browsered-jasmine-cucumber/Runner/StepExecuter.js"),
    __webpack_require__(/*! browsered-jasmine-cucumber/Runner/SpecStepsSearcher */ "./browsered-jasmine-cucumber/Runner/SpecStepsSearcher.js")
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (AsyncExecuter, StepExecuter, SpecStepsSearcher) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/SpecStepsSearcher.js":
/*!****************************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/SpecStepsSearcher.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/StepExecuter.js":
/*!***********************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/StepExecuter.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ "./browsered-jasmine-cucumber/Runner/utils.js":
/*!****************************************************!*\
  !*** ./browsered-jasmine-cucumber/Runner/utils.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by steb on 18.02.2015.
 */
!(module.exports = {
    extract: function (item, field, default_) {
        return (item && item[field])
            ? item[field]
            : default_;
    }
});

/***/ }),

/***/ "./browsered-jasmine-cucumber/core.js":
/*!********************************************!*\
  !*** ./browsered-jasmine-cucumber/core.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by steb on 18.02.2015.
 */
!(module.exports = {
    info: {
        version: '0.1.0',
        deps: {
            jasmine: '2.0.0'
        }
    }
});

/***/ }),

/***/ "./browsered-jasmine-cucumber/cucumber.js":
/*!************************************************!*\
  !*** ./browsered-jasmine-cucumber/cucumber.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function (exports) {
    exports.fetureGroups = {};
    exports.fetureGroups[undefined] = []; // что-бы эта группа выполнялась первой
    exports.stepsGroups = {};

    var featureRunner = {
        enqueue: function (feature, group) {
            var group = exports.fetureGroups[group] || (exports.fetureGroups[group] = []);
            group.push(feature);
        }
    };

    function Feature(featureDescription, groupName) {
        function Scenario(scenarioDescription, options) {
            function Examples() {
                var self = this;

                this.add = function (name, params) {
                    return self;
                };
            };


            var self = this;
            options = options || {};
            this.description = scenarioDescription;
            this.steps = [];
            this.addStep = function () {
                var args = Array.prototype.splice.call(arguments, 2);
                this.steps.push({
                    description: arguments[1],
                    fullDescription: arguments[0] + '  ' + arguments[1] + ' ' + (args && args.length > 0 ? JSON.stringify(args, null, 2) : ''),
                    arguments: args,
                    keyword: arguments[0]
                });
            };

            this.given = function () {
                this.addStep.apply(this, ['Given'].concat(Array.prototype.slice.call(arguments, 0)));

                self.and = function () {
                    this.addStep.apply(this, ['And'].concat(Array.prototype.slice.call(arguments, 0)));
                    return self;
                };

                return self;
            };
            this.when = function () {
                self.addStep.apply(this, ['When'].concat(Array.prototype.slice.call(arguments, 0)));

                self.and = function () {
                    self.addStep.apply(this, ['And'].concat(Array.prototype.slice.call(arguments, 0)));
                    return self;
                };

                return self;
            };
            this.then = function () {
                self.addStep.apply(this, ['Then'].concat(Array.prototype.slice.call(arguments, 0)));

                self.and = function () {
                    self.addStep.apply(this, ['And'].concat(Array.prototype.slice.call(arguments, 0)));
                    return self;
                };

                return self;
            };

            // could add this.and as a default - but at least this way you don't get and until you use given, when or then
            this.isOnly = options.only === true ? true : false;
            this.never = options.not === true ? true : false;


            this.fromBackground = makePrioritySetter('background');
            this.fromGroup = makePrioritySetter('group');
            function makePrioritySetter(level) {
                return function () {
                    var step = self.steps[self.steps.length - 1];
                    if (!step)
                        throw new Error("Can't modify level without adding a step");

                    step.level = level;
                    step.fullDescription += ' (' + level + ')';
                    return self;
                };
            }


            exports.examples = function () {
                return new Examples();
            };
        }


        var self = this;

        this.description = featureDescription;
        this.groupName = groupName;
        this.scenarios = [];
        exports.scenario = function (scenarioDescription) {
            var scenario = new Scenario(scenarioDescription);
            self.scenarios.push(scenario);
            return scenario;
        };

        //факт: сценарии в фиче можно помечать [не запускать, только эту заупскать]
        this.not = {
            scenario: function () {
                return exports.scenario.apply(self, Array.prototype.slice.call(arguments, 0).concat({ not: true}));
            }
        };
        // запускать только данный из всех
        this.only = {
            scenario: function () {
                return exports.scenario.apply(self, Array.prototype.slice.call(arguments, 0).concat({ only: true}));
            }
        };


        this.add = this.with = function (example) {
            return self;
        };

        //факт: фиче можно задать фон
        this.use = function (name) {
            if (!name || name == '')
                throw new Error('Bad background name');

            var
                scenario = self.scenarios[self.scenarios.length - 1];

            if (!scenario)
                throw new Error("Can't set up background without scenario");

            scenario.background = name;
            return self;
        };
    }

    function feature(featureName, groupName) {
        var f = new Feature(featureName, groupName);
        featureRunner.enqueue(f, groupName);
        return f;
    }

    function FeatureSteps(featurePattern) {
        var self = this;
        //TODO: зачем паттерн?
        this.pattern = new RegExp(featurePattern);
        this.beforeSteps = [];
        this.afterSteps = [];
        this.steps = [];
        this.then = function (pattern, definition) {
            return addStep(pattern, definition, true);
        };
        this.when = this.given = function () {
            return addStep.call(self, arguments[0], arguments[1]);
        };
        this.before = function (definition) {
            self.beforeSteps.push(definition);
            return this;
        };

        this.after = function (definition) {
            self.afterSteps.push(definition);
            return this;
        };

        function addStep(pattern, definition, forceExpect) {
            self.steps.push({
                pattern: new RegExp('^' + pattern + '$'),
                definition: definition,
                name: pattern,
                requireExpect: forceExpect
            });
            return self;
        };
    }

    function makeStepsDescriber(name) {
        return function (featurePattern) {
            var featureSteps = new FeatureSteps(featurePattern);
            var group = exports.stepsGroups[name] || (exports.stepsGroups[name] = []);

            group.push(featureSteps);
            return featureSteps;
        };
    }

    exports.feature = feature;
    exports.featureSteps = makeStepsDescriber('featureSteps');
    exports.groupSteps = makeStepsDescriber('groupSteps');
    exports.backgroundSteps = makeStepsDescriber('backgroundSteps');

}(typeof window !== 'undefined' ? window : module.exports));

/***/ })

/******/ });
});
//# sourceMappingURL=static.js.map
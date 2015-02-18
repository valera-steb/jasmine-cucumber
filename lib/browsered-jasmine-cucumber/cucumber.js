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
(function (exports) {
    exports.fetureGroups = {};
    exports.fetureGroups[undefined]=[]; // что-бы эта группа выполнялась первой
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

            this.fromBackground = this.fromGroup = function () {
                return self;
            };


            exports.examples = function () {
                return new Examples();
            };
        }


        var self = this;
        // что-бы мапить на все сценарии данной фичи методы before/after
        Scenario.prototype = this.scenarioProto = {};

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

        this.add = this.use = this.with = function (example) {
            return self;
        };
    }

    function feature(featureName, groupName) {
        var f = new Feature(featureName, groupName);
        featureRunner.enqueue(f, groupName);
        return f;
    }

    exports.steps = [];

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
                requireExpect: forceExpect
            });
            return self;
        };
    }

    exports.feature = feature;
    exports.featureSteps = function (featurePattern, callback) {
        var featureSteps = new FeatureSteps(featurePattern, callback);
        exports.steps.push(featureSteps);
        return featureSteps;
    };
}(typeof window !== 'undefined' ? window : module.exports));
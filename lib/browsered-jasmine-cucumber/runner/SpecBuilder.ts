import {
    CucumberModel, IFeatureModel, IFeaturesDictionaryModel, IScenarioModel, IScenariosDictionaryModel,
    IStepModel
} from "../cucumber/Model";
import {ITestFramework} from "./ITestFramework";
import {IConfig} from "./IConfig";
import {IScenarioPath} from "./Model";
import {ScenarioMethodsProvider} from "./ScenarioMethodsProvider";
import {CodeModel} from "../code/Model";
import {StepsContext} from "./StepsContext";
import {findStepFn} from "./domain";

export class SpecBuilder {
    private _testFramework: ITestFramework;
    private _code: CodeModel;

    build(model: CucumberModel, code: CodeModel, config: IConfig) {
        this._testFramework = config.specBuilder;
        this._code = code;

        for (let groupName in model.featuresGroups) {
            this._testFramework.declare(
                groupName,
                this.declareFeatures(model.featuresGroups[groupName], groupName));
        }

        this.declareFeatures(model.features)();

        for (let groupName in model.scenariosGroups) {
            this._testFramework.declare(
                groupName,
                this.declareScenariosDictionary(model.scenariosGroups[groupName], groupName)
            );
        }

        this.declareScenariosDictionary(model.scenarios)();
    }


    declareFeatures(features: IFeaturesDictionaryModel, groupName?: string): () => void {
        return () => {
            for (let featureName in features) {
                const feature = features[featureName];
                const key = feature.skip ? 'xdeclare' : 'declare';
                this._testFramework[key](featureName, this.declareFeature(feature, featureName, groupName));
            }
        };
    }

    declareFeature(feature: IFeatureModel, featureName: string, groupName?: string): () => void {
        return () => {
            for (let scenarioName in feature.scenarios) {
                const scenario = feature.scenarios[scenarioName];
                const key = scenario.skip ? 'xdeclare' : 'declare';
                this._testFramework[key](
                    scenario.description,
                    this.declareScenario(scenario, {feature: featureName, group: groupName}))
            }
        };
    }

    declareScenariosDictionary(scenarios: IScenariosDictionaryModel, groupName?: string): () => void {
        return () => {
            for (let name in scenarios) {
                const scenario = scenarios[name];
                const key = scenario.skip ? 'xdeclare' : 'declare';
                this._testFramework[key](
                    scenario.description,
                    this.declareScenario(scenario, {group: groupName}))
            }
        }
    }

    declareScenario(scenario: IScenarioModel, path: IScenarioPath): () => void {
        return () => {
            const stepsMethodsProvider = new ScenarioMethodsProvider(path, scenario, this._code);

            if (!scenario.examples || scenario.examples.length < 1) {
                return this.itSteps(scenario.steps, stepsMethodsProvider);
            }
            scenario.examples.forEach((example, id) => {
                this._testFramework.declare(
                    `example_${id}: ${JSON.stringify(example)}`,
                    () => {
                        this.itSteps(scenario.steps, stepsMethodsProvider, example);
                    });
            });
        }
    }

    itSteps(steps: IStepModel[], stepsMethodsProvider: ScenarioMethodsProvider, data?: any) {
        const ctx = {model: {}, data: data};
        const scenarioCtx = {
            activeStep: 0,
            lastStep: 0
        };

        stepsMethodsProvider.getBeforeActions().forEach(
            fn => this._testFramework.beforeAll(fn.bind(null, ctx)));

        steps.forEach(step => {
            const key = step.skip ? 'xit' : 'it';
            if (!step.skip)
                scenarioCtx.lastStep++;

            const run = this.runStep.bind(this, step, stepsMethodsProvider, ctx, scenarioCtx, scenarioCtx.lastStep);

            this._testFramework[key](step.description, function (done) {
                run(done);
            });
        });

        stepsMethodsProvider.getAfterActions().forEach(
            fn => this._testFramework.afterAll(fn.bind(null, ctx)));
    }

    runStep(step: IStepModel, stepsMethodsProvider: ScenarioMethodsProvider,
            ctx, scenarioCtx, stepId, done) {
        scenarioCtx.activeStep++;
        if (scenarioCtx.activeStep !== stepId)
            throw new Error('Can not skip previous steps');


        const stepsList = step.keyword === 'then'
            ? stepsMethodsProvider.getThenSteps()
            : stepsMethodsProvider.getGivenAndSteps();
        const stepFn = findStepFn(step, stepsList);

        const stepCtx = new StepsContext(done, ctx);
        // надо ещё данные вытягивать для функции, т.е. когда есть examples
        const args = (<any[]>[stepCtx])
            .concat(this._addExamplesData(stepFn.arguments, ctx.data))
            .concat(step.arguments);


        stepFn.d.step.fn.apply(stepCtx.model, args);
        if(!stepFn.d.step.isThen)
            this._testFramework.makeExpectStub();
    }

    private _addExamplesData(args, data) {
        return args.map(x => {
            const exec = /\(.*\)/.exec(x);
            return !!exec ? data[exec[1]] : x;
        });
    }
}

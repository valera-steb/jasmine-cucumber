import {
    CucumberModel, IFeatureModel, IFeaturesDictionaryModel, IScenarioModel, IScenariosDictionaryModel,
    IStepModel
} from "../cucumber/Model";
import {ITestFramework} from "./ITestFramework";
import {IConfig} from "./IConfig";
import {IScenarioPath} from "./Model";
import {ScenarioMethodsProvider} from "./ScenarioMethodsProvider";
import {CodeModel} from "../code/Model";

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
        stepsMethodsProvider.getBeforeActions().forEach(
            fn => this._testFramework.beforeAll(fn));

        steps.forEach(step => {
            const key = step.skip ? 'xit' : 'it';
            this._testFramework[key](step.description, () => {
            });
        });

        stepsMethodsProvider.getAfterActions().forEach(
            fn => this._testFramework.afterAll(fn));
    }
}

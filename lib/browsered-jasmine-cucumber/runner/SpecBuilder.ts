import {CucumberModel, IFeatureModel, IFeaturesDictionaryModel, IScenarioModel, IStepModel} from "../cucumber/Model";
import {ITestFramework} from "./ITestFramework";
import {IConfig} from "./IConfig";

export class SpecBuilder {
    private _testFramework: ITestFramework;

    declareSpec(model: CucumberModel, config: IConfig) {
        this._testFramework = config.specBuilder;

        for (let groupName in model.featuresGroups) {
            this._testFramework.declare(
                groupName,
                this.declareFeatures(model.featuresGroups[groupName]));
        }
    }

    declareFeatures(features: IFeaturesDictionaryModel): () => void {
        return () => {
            for (let featureName in features) {
                const feature = features[featureName];
                const key = feature.skip ? 'xdeclare' : 'declare';
                this._testFramework[key](featureName, this.declareFeature(feature));
            }
        };
    }

    declareFeature(feature: IFeatureModel): () => void {
        return () => {
            for (let scenarioName in feature.scenarios) {
                const scenario = feature.scenarios[scenarioName];
                const key = scenario.skip ? 'xdeclare' : 'declare';
                this._testFramework[key](scenario.description, this.declareScenario(scenario))
            }
        };
    }

    declareScenario(scenario: IScenarioModel): () => void {
        return () => {
            if (!scenario.examples || scenario.examples.length < 1) {
                return this.itSteps(scenario.steps);
            }
            scenario.examples.forEach((example, id) => {
                this._testFramework.declare(
                    `example_${id}: ${JSON.stringify(example)}`,
                    () => {
                        this.itSteps(scenario.steps, example);
                    });
            });
        }
    }

    itSteps(steps: IStepModel[], data?: any) {
        steps.forEach(step => {
            const key = step.skip ? 'xit' : 'it';
            this._testFramework[key](step.description, () => {
            });
        });
    }
}

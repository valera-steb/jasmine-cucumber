export class CucumberModel {
    featuresGroups: { [id: string]: IFeaturesDictionaryModel } = {};
    features: IFeaturesDictionaryModel = {};
    scenariosGroups: { [id: string]: IScenariosDictionaryModel } = {};
    scenarios: IScenariosDictionaryModel = {};

    active: IActive = {
        feature: {scenarios: {}},
        scenario: {
            description: null,
            steps: [],
            examples: []
        },
        step: {
            description: null,
            arguments: [],
            keyword: null,
            skip: false
        }
    };
}

export interface IActive {
    feature: IFeatureModel;
    scenario: IScenarioModel;
    step: IStepModel;
}

export interface IFeaturesDictionaryModel {
    [id: string]: IFeatureModel;
}

export interface IFeatureModel {
    scenarios: IScenariosDictionaryModel;
    skip?: boolean;
}

export interface IScenariosDictionaryModel {
    [index: string]: IScenarioModel;
}

export interface IScenarioModel {
    description: string;
    steps: IStepModel[];
    examples: any[];
    skip?: boolean;
    background?: string;
}

export interface IStepModel {
    description: string;
    arguments: any[];
    keyword: string;
    skip?: boolean;
    from?: FromOptions;
}

export type FromOptions = 'background' | 'group' | 'feature';
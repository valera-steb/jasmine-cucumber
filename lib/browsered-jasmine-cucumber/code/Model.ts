export class CodeModel {
    //featuresGroupsSteps;
    featuresSteps: ICodeStepsDictionaryModel = {};
    featuresScenariosSteps: { [feature: string]: ICodeStepsDictionaryModel } = {};

    //scenariosGroupsSteps;
    scenariosSteps: ICodeStepsDictionaryModel = {};

    groupsSteps: ICodeStepsDictionaryModel = {};
    backgroundSteps: ICodeStepsDictionaryModel = {};
}

export interface ICodeStepsDictionaryModel {
    [index: string]: ICodeStepsSetModel;
}

export interface ICodeStepsSetModel {
    before: IFramingFn[],
    after: IFramingFn[],
    steps: ICodeStepModel[]
}

export interface ICodeStepModel {
    pattern: RegExp;
    description: string;
    fn: IStepFn;
    isThen: boolean;
}

export interface IFramingFn {
    (ctx: any): void;
}

export interface IStepFn {
    (ctx?: any, ...params: any[]): void;
}
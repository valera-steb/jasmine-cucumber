import {CodeStep, isNullOrEmptyString} from "./CodeStep";
import {CodeModel, ICodeStepsDictionaryModel, ICodeStepsSetModel} from "./Model";

export class Code {
    ctx = new CodeModel();

    constructor() {
        ['featureSteps', 'scenarioSteps', 'groupSteps', 'backgroundSteps']
            .forEach(name => {
                this[name] = this._addSteps.bind(this, name);
            });
    }

    featureSteps: (name: string) => CodeStep;
    scenarioSteps: (name: string, feature?: string) => CodeStep;
    groupSteps: (name: string) => CodeStep;
    backgroundSteps: (name: string) => CodeStep;

    private _addSteps(key: string, name: string, feature: string): CodeStep {
        console.log(arguments);
        if (isNullOrEmptyString(name))
            throw new Error('Name required');

        var container: ICodeStepsDictionaryModel;
        switch (key) {
            case 'featureSteps':
                container = this.ctx.featuresSteps;
                break;
            case 'scenarioSteps':
                container = this.ctx.scenariosSteps;
                if (!isNullOrEmptyString(feature)) {
                    if (!this.ctx.featuresScenariosSteps[feature])
                        this.ctx.featuresScenariosSteps[feature] = {};
                    container = this.ctx.featuresScenariosSteps[feature];
                }
                break;
            case 'groupSteps':
                container = this.ctx.groupsSteps;
                break;
            case 'backgroundSteps':
                container = this.ctx.backgroundSteps;
                break;

            default:
                throw new Error(`Unknown key: ${key}`)
        }

        if (!container[name])
            container[name] = getNewStepsSet();

        return new CodeStep(container[name]);
    }
}

export interface IStepsFn {
    (name: string): CodeStep;
}

export interface IScenarioStepsFn {
    (name: string, feature?: string): CodeStep
}

export const staticCode = new Code();

export const featureSteps: IStepsFn = staticCode.featureSteps;
export const scenarioSteps: IScenarioStepsFn = staticCode.scenarioSteps;
export const groupSteps: IStepsFn = staticCode.groupSteps;
export const backgroundSteps: IStepsFn = staticCode.backgroundSteps;


function getNewStepsSet(): ICodeStepsSetModel {
    return {
        before: [],
        after: [],
        steps: []
    }
}

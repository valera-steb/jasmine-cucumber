import {ISteps} from "./Steps";
import {CucumberModel, IActive} from "./Model";

export function feature(ctx: CucumberModel, name: string, group?: string): Feature {
    var features = ctx.features;
    if (group) {
        if (!ctx.featuresGroups[group])
            ctx.featuresGroups[group] = {};
        features = ctx.featuresGroups[group];
    }
    if (!features[name])
        features[name] = {scenarios: {}};

    ctx.active.feature = features[name];

    return new Feature(ctx.active);
}

export interface IAddFeature {
    add(steps: ISteps): IFeature;
}

export interface IFeature extends IAddFeature {
    x: IAddFeature;
}

export class Feature implements IFeature {

    constructor(private _active: IActive) {
    }

    public x: IAddFeature = {
        add: steps => {
            this._active.scenario.skip = true;
            return this.add(steps);
        }
    };

    public add(steps: ISteps): Feature {
        const scenarios = this._active.feature.scenarios;
        const name = this._active.scenario.description;
        if (scenarios[name])
            throw new Error(`Scenario '${name}' already exist`);

        scenarios[name] = this._active.scenario;
        return this;
    }
}

import * as feature from "./Feature";
import * as scenario from "./Scenario";
import {IStepsDescription} from "./Steps";
import {CucumberModel} from "./Model";

const ns = {
    feature: feature,
    scenario: scenario
};

export function exclude(ctx: CucumberModel): IExclude {
    const excluder: any = {};
    ['feature', 'scenario'].forEach(name => {
        excluder[name] = function () {
            ns[name][name].bind(this, ctx).apply(this, arguments);
            ctx.active[name].skip = true;
        }
    });
    return excluder;
}

export interface IExclude {
    feature: (name: string, group?: string) => feature.IFeature;
    scenario: (name: string, group?: string) => IStepsDescription;
}
import * as f from "./Feature";
import * as st from './Steps';
import * as sc from './Scenario';
import {CucumberModel} from "./Model";
import * as ex from "./Exclude";

export const ctx = new CucumberModel();

export const feature = (name: string, group?: string) => f.feature(ctx, name, group);
export const steps = (name: string) => st.steps(ctx, name);
export const scenario = (name: string, group?: string) => sc.scenario(ctx, name, group);
export const x = ex.exclude(ctx);
export const exclude = x;


export interface IFeatureFn {
    (name: string, group?: string): f.Feature;
}

export interface IScenarioFn {
    (name: string, group?: string): st.IStepsDescription;
}

export interface IStepsFn {
    (name: string): st.IStepsDescription;
}

export {IExclude} from "./Exclude";


export class Cucumber {
    ctx = new CucumberModel();

    feature = (name: string, group?: string) => f.feature(this.ctx, name, group);
    steps = (name: string) => st.steps(this.ctx, name);
    scenario = (name: string, group?: string) => sc.scenario(this.ctx, name, group);
    x = ex.exclude(this.ctx);
}
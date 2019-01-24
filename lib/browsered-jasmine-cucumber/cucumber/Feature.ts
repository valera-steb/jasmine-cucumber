import {ISteps} from "./Steps";

export function feature(name: string, group?: string): Feature {
    return new Feature();
}

export interface IAddFeature {
    add(steps: ISteps): IFeature;
}

export interface IFeature extends IAddFeature {
    x: IAddFeature;
}

export class Feature implements IFeature {

    public x: IAddFeature;

    public add(steps: ISteps): Feature {
        return this;
    }
}
import {ISteps, IStepsDeclaration, IStepsExamples, IStepsModifier} from "./Steps";

export function scenario(name: string, group?: string): ISteps{
    return new Scenario();
}

export class Scenario implements IStepsModifier {

    public x: IStepsDeclaration;

    public given = (pattern: string, data?: any) => this.when(pattern, data);
    public and = (pattern: string, data?: any) => this.when(pattern, data);
    public then = (pattern: string, data?: any) => this.when(pattern, data);

    public when(pattern: string, data?: any): IStepsModifier {
        return this;
    }


    public fromBackground(name?: string): ISteps {
        return this;
    }

    public fromGroup(): ISteps {
        return this;
    }

    public examples(data: any) {
    }

    public use(background: string): IStepsExamples {
        return this;
    }
}
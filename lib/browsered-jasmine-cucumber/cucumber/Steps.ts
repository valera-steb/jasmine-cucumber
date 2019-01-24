export function steps(name: string): ISteps {
    return new Steps();
}

export interface IStepsExamples {
    examples(data: any[]);
}

export interface IStepsDeclaration {
    given(pattern: string, data?: any): IStepsModifier;

    when(pattern: string, data?: any): IStepsModifier;

    and(pattern: string, data?: any): IStepsModifier;

    then(pattern: string, data?: any): IStepsModifier;
}

export interface ISteps extends IStepsDeclaration, IStepsExamples {
    x: IStepsDeclaration;

    use(background: string): IStepsExamples;
}


export interface IStepsModifier extends ISteps {
    fromBackground(name?: string): ISteps;

    fromGroup(): ISteps;
}


export class Steps implements IStepsModifier {

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
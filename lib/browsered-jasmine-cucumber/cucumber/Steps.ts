import {CucumberModel, FromOptions, IActive, IScenarioModel} from "./Model";

export function steps(ctx: CucumberModel, name: string): IStepsDescription {
    ctx.active.scenario = {
        description: name,
        steps: [],
        examples: [],
    };
    return new Steps(ctx.active);
}

export interface ISteps {
}

export interface IStepsExamples extends ISteps {
    examples(data: any[]);
}

export interface IStepsDeclaration extends ISteps {
    given(pattern: string, ...data: any[]): IStepsModifier;

    when(pattern: string, ...data: any[]): IStepsModifier;

    and(pattern: string, ...data: any[]): IStepsModifier;

    then(pattern: string, ...data: any[]): IStepsModifier;
}

export interface IStepsDescription extends IStepsDeclaration, IStepsExamples {
    x: IStepsDeclaration;

    use(background: string): IStepsExamples;
}


export interface IStepsModifier extends IStepsDescription {
    fromBackground(): IStepsDescription;

    fromGroup(): IStepsDescription;

    fromFeature(): IStepsDescription;
}

export class Steps implements IStepsModifier {

    constructor(private _active: IActive) {
        const exclude: any = {};
        ['given', 'and', 'then', 'when'].forEach(name => {
            exclude[name] = (pattern: string, ...data: any[]) => {
                const r = this._add(name, pattern, data);
                this._active.step.skip = true;
                return r;
            }
        });
        this.x = exclude;
    }

    public x: IStepsDeclaration;

    public given = (pattern: string, ...data: any[]) => this._add('given', pattern, data);
    public and = (pattern: string, ...data: any[]) => this._add('and', pattern, data);
    public then = (pattern: string, ...data: any[]) => this._add('then', pattern, data);
    public when = (pattern: string, ...data: any[]) => this._add('when', pattern, data);

    private _add(keyword: string, pattern: string, data?: any): IStepsModifier {
        this._active.step = {
            description: pattern,
            arguments: data,
            keyword: keyword
        };
        this._active.scenario.steps.push(this._active.step);
        return this;
    }


    public fromBackground = () => this._from('background');
    public fromGroup = () => this._from('group');
    public fromFeature = () => this._from('feature');

    private _from(type: FromOptions) {
        this._active.step.from = type;
        return this;
    }

    public examples(data: any): ISteps {
        this._active.scenario.examples = data;
        return this;
    }

    public use(background: string): IStepsExamples {
        this._active.scenario.background = background;
        return this;
    }
}
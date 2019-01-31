import {IStepsDescription, steps} from "./Steps";
import {CucumberModel} from "./Model";

export function scenario(ctx: CucumberModel, name: string, group?: string): IStepsDescription {
    const ret = steps(ctx, name);

    var scenarios = ctx.scenarios;
    if (group) {
        if (!ctx.scenariosGroups[group])
            ctx.scenariosGroups[group] = {};
        scenarios = ctx.scenariosGroups[group];
    }

    if (scenarios[name])
        throw new Error(`There is scenario with name: ${name}`);
    scenarios[name] = ctx.active.scenario;

    return ret;
}


/*
export class Scenario implements IStepsModifier {

    constructor(private ctx: CucumberModel) {
        this.x = this;
    }

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
}*/

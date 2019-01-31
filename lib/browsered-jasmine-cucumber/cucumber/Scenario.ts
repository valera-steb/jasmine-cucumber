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

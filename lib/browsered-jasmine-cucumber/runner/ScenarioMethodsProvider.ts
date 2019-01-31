import {IScenarioModel} from "../cucumber/Model";
import {CodeModel} from "../code/Model";
import {IScenarioPath} from "./Model";
import {once} from "./utils";

export class ScenarioMethodsProvider {
    private _steps;
    private _stepsOrder = ['fs', 'f', 's', 'g', 'b'];

    constructor(private _path: IScenarioPath,
                private _scenario: IScenarioModel,
                private _code: CodeModel) {

        this.getBeforeActions = once(
            () => this._concat(x => x['before'], plainSelector));
        this.getAfterActions = once(() =>
            this._concat(x => x['after'], plainSelector).reverse());

        this.getGivenAndSteps = once(() =>
            this._concat(
                x => (x['steps'] || []).filter(y => !y.isThen),
                groupedSelector));

        this.getThenSteps = once(() =>
            this._concat(
                x => (x['steps'] || []).filter(y => y.isThen),
                groupedSelector));
    }

    getBeforeActions: () => Action[];
    getAfterActions: () => Action[];

    getGivenAndSteps: () => any;
    getThenSteps: () => any;


    private _getSteps() {
        if (this._steps)
            return this._steps;

        this._steps = {fs: {}, f: {}, g: {}, b: {}, s: {}};

        if (this._path.feature) {
            const fs = this._code.featuresScenariosSteps[this._path.feature] || {};
            this._steps['fs'] = fs[this._scenario.description] || {};

            this._steps['f'] = this._code.featuresSteps[this._path.feature] || {};
        } else {
            this._steps['s'] = this._code.scenariosSteps[this._scenario.description] || {};
        }

        if (this._path.group)
            this._steps['g'] = this._code.groupsSteps[this._path.group] || {};

        if (this._scenario.background)
            this._steps['b'] = this._code.backgroundSteps[this._scenario.background] || {};

        return this._steps;
    }

    private _concat(where, select) {
        const steps = this._getSteps();
        var ret = [];

        this._stepsOrder.forEach(key => {
            const filtered = where(steps[key]);
            if (!filtered) return;

            const items = filtered.map(x => select(x, key));
            ret = ret.concat(items);
        });

        return ret;
    }
}


function plainSelector(fn) {
    return fn;
}

function groupedSelector(fn, key) {
    return {
        step: fn,
        from: key
    };
}
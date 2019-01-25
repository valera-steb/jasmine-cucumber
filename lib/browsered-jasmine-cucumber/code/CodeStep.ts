import {ICodeStepsSetModel, IFramingFn, IStepFn} from "./Model";

export class CodeStep {
    constructor(private _set: ICodeStepsSetModel) {
        this.given = this.when = (pattern: string, fn: IStepFn) => this._addStep(pattern, fn);
    }

    given: (pattern: string, fn: IStepFn) => CodeStep;
    when: (pattern: string, fn: IStepFn) => CodeStep;
    then: (pattern: string, fn: IStepFn) => CodeStep = (p, f) => this._addStep(p, f, true);

    before: (fn: IFramingFn) => CodeStep = fn => this._addFraming('before', fn);
    after: (fn: IFramingFn) => CodeStep = fn => this._addFraming('after', fn);

    private _addStep(pattern: string, fn: IStepFn, isThen: boolean = false) {
        if (isNullOrEmptyString(pattern))
            throw new Error('Pattern required.');
        if (typeof fn !== 'function')
            throw new Error('Function required.');

        this._set.steps.push({
            pattern: new RegExp('^' + pattern + '$'),
            fn: fn,
            isThen: isThen
        });

        return this;
    }

    private _addFraming(name: string, fn: IFramingFn){
        this._set[name].push(fn);
        return this;
    }
}

export function isNullOrEmptyString(name: string) {
    return !name || typeof name !== 'string' || name === '';
}
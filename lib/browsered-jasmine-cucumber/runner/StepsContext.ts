export class StepsContext {
    constructor(private _done, ctx) {
        this.model = ctx.model;
        this.data = ctx.data;
    }

    model: any;
    data: any;

    async() {
        const tmp = this._done;
        this._done = null;
        return tmp;
    }

    done() {
        if (this._done)
            this._done();
    }
}
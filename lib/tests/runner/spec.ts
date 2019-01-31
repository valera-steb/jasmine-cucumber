import {IScenarioFn} from "../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {IScenarioStepsFn} from "../../browsered-jasmine-cucumber/code/code";

export function executeSpec(scenario: IScenarioFn) {
    scenario('сложение')
        .when('Enter "1"')
        .and('Select "+"')
        .and('Enter "2"')
        .and('Select "="')
        .then('"3" on screen');
}

export function executeStep(scenarioSteps: IScenarioStepsFn) {
    scenarioSteps('сложение')
        .before(function (ctx) {
            this.calc = new Calc();
        })
        .when('Enter "(.*)"', function (ctx, x) {
            this.calc.enter(x);
        })
        .when('Select "(.*)"', function (ctx, op) {
            this.calc.select(op);
        })
        .then('"(.*)" on screen', function (ctx, s) {
            expect(this.calc.screen).toBe(s);
        });
}

class Calc {
    private _expr = [];

    screen: 0;

    enter(x) {
        this._validateExprLength();
        switch (this._expr.length) {
            case 0:
            case 2:
                this._expr.push(x);
                break;

            case 1:
            case 3:
                this._expr[this._expr.length - 1] = x;
                break;
        }
    }

    select(op) {
        this._validateExprLength();
        const isCmd = ['=', 'rst'].indexOf(op) >= 0;
        isCmd ? this._executeCmd(op) : this._addOp(op);
    }

    private _executeCmd(cmd) {
        if (cmd === 'rst') {
            this._expr = [];
            return;
        }

        switch (this._expr.length) {
            case 0:
            case 1:
            case 2:
                return;

            case 3:
                const expr = this._expr.join('');
                this.screen = eval(expr);
                this._expr = [];
                return;
        }
    }

    private _addOp(op) {
        switch (this._expr.length) {
            case 0:
                return this._expr = [0, op];
            case 1:
                return this._expr.push(op);
            case 2:
                return this._expr[1] = op;
            case 3:
                this._executeCmd('=');
                return this._expr = [this.screen, op];
        }
    }

    private _validateExprLength() {
        if (this._expr.length > 3)
            throw new Error(`error expr length: ${this._expr.length}`);
    }
}
import {Cucumber} from "../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {executeSpec} from "./spec";

var cucumber: Cucumber;

describe('cucumber spec', () => {

    beforeEach(() => {
        cucumber = new Cucumber();
    });

    it('should build spec object', () => {
        executeSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);
        delete cucumber.ctx.active;

        const spec = require('./spec.json');
        expect(JSON.stringify(cucumber.ctx)).toBe(JSON.stringify(spec));
    });

    it('should fail on scenario().and()', () => {
        expect(() => {
            cucumber.scenario('s').and('x');
        }).toThrow();
    });

    it('should transfer previous key to scenario().and() step', () => {
        cucumber.scenario('s')
            .when('w')
            .and('a')
            .then('t')
            .and('at');

        const steps = cucumber.ctx.scenarios['s'].steps;
        expect(steps[1].keyword).toBe('when');
        expect(steps[3].keyword).toBe('then');
    })
});
import {Cucumber} from "../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {executeSpec} from "./spec";

describe('cucumber spec', () => {
    it('should build spec object', () => {
        const cucumber = new Cucumber();
        executeSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);
        delete cucumber.ctx.active;

        const spec = require('./spec.json');
        expect(JSON.stringify(cucumber.ctx)).toBe(JSON.stringify(spec));
    });
});
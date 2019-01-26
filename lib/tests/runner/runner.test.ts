import {Cucumber} from "../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {Code} from "../../browsered-jasmine-cucumber/code/code";
//import {executeSpec, executeStep} from "./spec";
import {FakeSpecBuilder} from "./FakeSpecBuilder";
import {executeSpec} from "../specs/spec";
import {SpecBuilder} from "../../browsered-jasmine-cucumber/runner/SpecBuilder";

describe('runner', () => {
    it('should work', () => {
        const cucumber = new Cucumber();
        const code = new Code();

        //executeSpec(cucumber.scenario);
        //executeStep(code.scenarioSteps);
        executeSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);

        const log = [];
        const fakeSb = new FakeSpecBuilder(log);
        const specBuilder = new SpecBuilder();
        specBuilder.declareSpec(cucumber.ctx, {
            specBuilder: fakeSb, separateSteps: true
        });

        const sd = require('./specData');
        expect(log).toEqual(sd);
    });
});
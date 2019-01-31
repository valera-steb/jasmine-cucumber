import {Cucumber} from "../../browsered-jasmine-cucumber/cucumber/Cucumber";
import {Code} from "../../browsered-jasmine-cucumber/code/code";
import {FakeTestFramework} from "./FakeSpecBuilder";
import {executeSpec} from "../specs/spec";
import {SpecBuilder} from "../../browsered-jasmine-cucumber/runner/SpecBuilder";
import * as fullSpec from './fullSpec';
import * as fullSteps from './fullSpecSteps';
import {buildLogger} from "../utils";

var cucumber: Cucumber;
var code: Code;
var log: string[];
var fakeTF: FakeTestFramework;
var specBuilder: SpecBuilder;


describe('runner', () => {

    beforeEach(()=>{
        cucumber = new Cucumber();
        code = new Code();

        log = [];
        fakeTF = new FakeTestFramework(log);
        specBuilder = new SpecBuilder();
    });

    it('should declare spec in testingFramework', () => {

        executeSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);

        specBuilder.build(
            cucumber.ctx,
            code.ctx,
            {
                specBuilder: fakeTF, separateSteps: true
            });

        const sd = require('./specData');
        expect(log).toEqual(sd);
    });

    it('should correlate spec and steps', ()=>{
        const lw = buildLogger(log);

        fullSpec.executeFullSpec(cucumber.feature, cucumber.steps, cucumber.scenario, cucumber.x);
        fullSteps.executeSteps(code.backgroundSteps, code.featureSteps,
            code.groupSteps, code.scenarioSteps, lw);

        specBuilder.build(
            cucumber.ctx,
            code.ctx,
            {
                specBuilder: fakeTF, separateSteps: true
            });

        const sd = require('./fullSpecData');
        expect(log).toEqual(sd);
    });
});
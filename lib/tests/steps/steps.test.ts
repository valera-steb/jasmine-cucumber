import {Code, staticCode} from "../../browsered-jasmine-cucumber/code/code";
import {executeSteps} from "./steps";


describe('steps', () => {
    it('should build steps object', () => {

        const code = new Code();
        executeSteps(code.backgroundSteps, code.featureSteps,
            code.groupSteps, code.scenarioSteps);

        const json = require('./steps.json');
        expect(JSON.stringify(code.ctx)).toBe(JSON.stringify(json));
    });
});

import {ITestFramework} from "../../browsered-jasmine-cucumber/runner/ITestFramework";

export class FakeSpecBuilder implements ITestFramework {

    constructor(log: string[]) {
        ['declare', 'it', 'xdeclare', 'xit'].forEach(method => {
            this[method] = function (name, fn) {
                const isDeclare = method.indexOf('declare') > -1;
                log.push(isDeclare
                    ? `/ ${method} ${name} \\`
                    : `=> ${method} ${name}`);

                if (method[0] !== 'x')
                    fn();

                if (isDeclare)
                    log.push(`\\ ${method} ${name} /`);
            }
        });
    }

    declare: (name: string, fn: () => void) => void;
    it: (name: string, fn) => void;

    xdeclare: (name: string, fn: () => void) => void;
    xit: (name: string, fn) => void;
}
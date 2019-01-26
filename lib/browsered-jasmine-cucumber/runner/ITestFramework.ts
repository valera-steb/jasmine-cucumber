export interface ITestFramework {
    declare(name: string, fn: () => void);
    it(name: string, fn);

    xdeclare(name: string, fn: () => void);
    xit(name: string, fn);
}
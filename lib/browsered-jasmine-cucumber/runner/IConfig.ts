import {ITestFramework} from "./ITestFramework";

export interface IConfig {
    specBuilder: ITestFramework;
    separateSteps: boolean;
}
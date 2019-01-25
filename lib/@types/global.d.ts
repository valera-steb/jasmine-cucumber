interface IRequire {
    (name: string): any;

    context: any;
}

declare const require: IRequire;
interface IRequire {
    (name: string): any;

    context: any;
}


interface IModule {
    exports: any;
}

declare const require: IRequire;
declare const module: IModule;

declare type Action = () => void;
var path = require('path');

module.exports = module.exports = {
    mode: 'development',
    entry: {
        'browsered-jasmine-cucumber': './browsered-jasmine-cucumber.js',
       //'jasmin-runner': './jasminRunner/JasmineRunner.ts',
        //'cucumber': './cucumber/Cucumber.ts',
        demo: './demo/index.ts',
        tests: './tests/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './../dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            'browsered-jasmine-cucumber': path.resolve(__dirname, './browsered-jasmine-cucumber')
        }
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                }]
            }
        ]
    }
};

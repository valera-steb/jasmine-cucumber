var path = require('path');

module.exports = module.exports = {
    mode: 'development',
    entry: {
        static: './browsered-jasmine-cucumber.js'
    },
    output: {
        path: path.resolve(__dirname, './../dist'),
        filename: '[name].js',
        library: 'browsered-jasmine-cucumber',
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

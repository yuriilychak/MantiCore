const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".jsx", ".json", ".js"],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    output: {
        filename: 'MantiCore.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                mangle: {
                    properties: {
                        regex: /^_/
                    }
                }
            }
        })]
    }
};
const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JsDocPlugin = require('jsdoc-webpack-plugin-v2');

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
        path: path.resolve(__dirname, 'dist'),
        library: 'MANTICORE'
    },
    plugins: [
        new JsDocPlugin({
            conf: path.join(__dirname, 'jsdoc.json'),
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: true,
                ie8: false
            }
        })]
    },

    devtool: "source-map"
};
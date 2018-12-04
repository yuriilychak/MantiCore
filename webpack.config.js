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
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
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
                ie8: false,
                mangle: true
            },
            minify(file, sourceMap) {
                // https://github.com/mishoo/UglifyJS2#minify-options
                const uglifyJsOptions = {
                    compress: true,
                    ie8: false,
                    mangle: true
                };

                function replaceAll(target, search, replacement) {
                    return target.split(search).join(replacement);
                }

                const regExMethod = /(?:^|\W)key: "_(\w+)(?!\w)"/g;
                const regExProperty = /(?:^|\W)this._(\w+)(?!\w)/g;
                const prefixMethod = "pm";
                const prefixVariable = "pv";
                //const found = file.match(regex);
                let resStr, found, foundCount, i;
                for (let key in file) {
                    resStr = file[key];
                    found = resStr.match(regExMethod);
                    foundCount = found.length;

                    for (i = 0; i < foundCount; ++i) {
                        resStr = replaceAll(resStr, found[i].replace(' key: "', "").replace('"', ""), prefixMethod + i.toString(16));
                    }

                    found = resStr.match(regExProperty);
                    foundCount = found.length;

                    for (i = 0; i < foundCount; ++i) {
                        found[i] = found[i].split(".")[1];
                    }

                    found = found.sort().filter(function(item, pos, ary) {
                        return !pos || item !== ary[pos - 1];
                    });

                    foundCount = found.length;

                    for (i = 0; i < foundCount; ++i) {
                        resStr = replaceAll(resStr, found[i], prefixVariable + i.toString(16));
                    }

                    file[key] = resStr;
                }


                if (sourceMap) {
                    uglifyJsOptions.sourceMap = {
                        content: sourceMap,
                    };
                }

                return require('terser').minify(file, uglifyJsOptions);
            },
        })]
    },

    devtool: "source-map"
};
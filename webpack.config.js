const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "production",
    resolve: {
        extensions: [".jsx", ".json", ".js"],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    output: {
        filename: 'MantiCore.js',
        path: path.resolve(__dirname, 'dist')
    }
};
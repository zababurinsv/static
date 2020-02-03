const path = require('path');
const WebpackModules = require('webpack-modules');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './main-table.js',
    output: {
        path: path.resolve('/srv/dev/js/module'),
        filename: 'table.bundle.js'
    },
    plugins: [
        new WebpackModules(),
        new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
        })
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry : './src',
    output: {
        path    : path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    externals: {
        ws: 'WebSocket',
    },
    module: {
        rules: [
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                use    : {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [new MinifyPlugin({}, {})],
};

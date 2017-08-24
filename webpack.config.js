const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry : './src',
    output: {
        library      : 'documentUploader',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path         : __dirname,
        filename     : 'documentUploader.js',
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

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

// Start with dev config
const config = require('./webpack.config.js');

// Remove local server and code map
config.devServer = undefined;
//config.devtool = '';
config.mode = 'production';

config.optimization = {
    usedExports: true,
    sideEffects: true,
    splitChunks: {
        chunks: 'async', // TODO possibly set to all
        automaticNameDelimiter: '-',
        name: true,
    },
};


// Add optimization plugins
config.plugins.push(
    new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
    }),
);


// Replace local with development server config
config.resolve.alias.networkConfig = `${__dirname}/src/networkConfig.dev.json`;
module.exports = config;

var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var libraryName = 'gamesaw';
var plugins = [];
var outputFile;

if (yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

var config = {
    entry: [
        __dirname + '/src/index.ts'
    ],

    output: {
        path: path.join(__dirname, '/dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNameDefine: true
    },

    devtool: 'source-map',

    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.ts', '.js']
    },

    plugins: plugins,

    tslint: {
        emitErrors: true,
        failOnHint: true
    },

    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'tslint-loader', exclude: /node_modules/ }
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/  }
        ]
    }
};

module.exports = config;

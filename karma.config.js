var webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [
            './src/**/*.spec.ts'
        ],

        exclude: [],

        plugins: ['karma-*'],

        preprocessors: {
            './src/**/*.ts': ['webpack']
        },

        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    });
}

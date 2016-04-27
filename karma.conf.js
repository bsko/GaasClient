'use strict';

var yargs = require('yargs');
var path = require('path');

module.exports = function(config) {
  var args = yargs.argv;
  var WATCH = !!args.watch;

  config.set({
    basePath: '',
    autoWatch: WATCH,
    singleRun: !WATCH,

    files: [
      './node_modules/angular/angular.js',
      './src/index.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './src/**/*.test.js'
    ],

    preprocessors: {
      'src/index.js': ['webpack'],
      'src/**/*.test.js': ['webpack']
    },
    reporters: ['mocha'],

    webpack: {
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          include: [
            path.resolve(__dirname, 'src')
          ],
          exclude: /(shim)/,
          query: {
            cacheDirectory: true,
            presets: ['es2015']
          }
        }],

        noParse: [
          /^angular(\-.*)?$/
        ]
      },
      devtool: 'eval'
    },

    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true
      }
    },

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha-reporter')
    ]
  });
};

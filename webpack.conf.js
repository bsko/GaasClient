'use strict';

var path = require('path');
var webpack = require('webpack');

/**
 * Config
 * Reference: http://webpack.github.io/docs/configuration.html
 * This is the object where all configuration gets set
 */
var config = {};

/**
 * Entry
 * Reference: http://webpack.github.io/docs/configuration.html#entry
 * Should be an empty object if it's generating a test build
 * Karma will set this when it's a test build
 */
config.entry = {
  index: 'index.js'
};

/**
 * Output
 * Reference: http://webpack.github.io/docs/configuration.html#output
 */
config.output = {
  // Absolute output directory
  path: __dirname + '/dist',
  filename: '[name].js',
  libraryTarget: 'umd',
  library: 'gaas-client',
  umdNamedDefine: true,
  externals: {
    'angular': 'angular'
  }
};

config.bail = true;

/**
 * Devtool
 * Reference: http://webpack.github.io/docs/configuration.html#devtool
 * Type of sourcemap to use per build type
 */
config.devtool = 'source-map';

config.resolve = {
  root: path.resolve('src'),
  modulesDirectories: [
    'node_modules'
  ],
  unsafeCache: true
};

/**
 * Loaders
 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
 * List: http://webpack.github.io/docs/list-of-loaders.html
 * This handles most of the magic responsible for converting modules
 */

// Initialize module
config.module = {
  preLoaders: [{
    test: /\.js/,
    loader: 'eslint-loader',
    include: [
      path.resolve(__dirname, 'src')
    ],
    query: {
      failOnError: true
    }
  }],
  loaders: [{
    // JS LOADER
    // Reference: https://github.com/babel/babel-loader
    // Transpile .js files using babel-loader
    // Compiles ES6 and ES7 into ES5 code
    test: /\.js$/,
    loader: 'babel',
    include: [
      path.resolve(__dirname, 'src')
    ],
    exclude: /shim/,
    query: {
      cacheDirectory: true,
      presets: ['es2015']
    }
  }]
};

config.plugins = [
  // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
  // Only emit files when there are no errors
  new webpack.NoErrorsPlugin(),

  // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
  // Dedupe modules in the output
  new webpack.optimize.DedupePlugin(),

  // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
  // Minify all javascript, switch loaders to minimizing mode
  new webpack.optimize.UglifyJsPlugin()
];

module.exports = config;

var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./base.webpack.config.js');

var basePath = __dirname;

module.exports = function () {
  return webpackMerge(commonConfig, {
    // For development https://webpack.js.org/configuration/devtool/#for-development
    devtool: 'inline-source-map',

    output: {
      path: path.join(basePath, 'dist'),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader']
        },
      ]
    },

    devServer: {
      port: 8080,
    }
  });
}

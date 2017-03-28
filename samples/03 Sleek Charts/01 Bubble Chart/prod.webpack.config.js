var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./base.webpack.config.js');

var basePath = __dirname;

module.exports = function () {
  return webpackMerge(commonConfig, {
    // For production https://webpack.js.org/configuration/devtool/#for-development
    devtool: 'cheap-module-source-map',

    output: {
      path: path.join(basePath, 'dist'),
      filename: '[chunkhash].[name].js',
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  camelCase: true
                }
              },
              { loader: 'sass-loader' }
            ]
          })
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
              loader: 'css-loader'
            }
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin({
        filename: '[chunkhash].[name].css',
        allChunks: true
      })
    ]
  });
}

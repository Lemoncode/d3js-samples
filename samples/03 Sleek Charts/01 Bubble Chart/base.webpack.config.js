var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var basePath = __dirname;
var dataPath = basePath + '/data';

module.exports = {
  context: path.join(basePath, 'src'),
  resolve: {
    extensions: ['.js', '.css']
  },
  entry: {
    app: './app.js',
    vendor: [
      'd3'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
			hash: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new CopyWebpackPlugin([
      {from: '../data/StatsPerCountry.txt', to: 'data.txt'}
    ])
  ]
};

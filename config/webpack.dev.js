var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  debug: true,

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8080/',
    filename: 'webapp/[name].js',
    chunkFilename: 'webapp/[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    contentBase: './src/public',
    historyApiFallback: true,
    stats: 'normal'
  }
});
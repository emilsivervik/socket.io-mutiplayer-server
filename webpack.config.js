var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals')
 
module.exports = {
  target: 'node',
  entry: './src/app.js',  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
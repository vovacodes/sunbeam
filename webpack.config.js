var path = require('path');

module.exports = {
  entry: {
    demo: ['./demo/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'demo'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'source-map'
};

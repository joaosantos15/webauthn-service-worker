const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    index: path.join(__dirname, './src/script.js'),
    worker: path.join(__dirname, './src/service-worker/sw.js')
  },

  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
  },

  mode: process.env.NODE_ENV || 'development',

  watchOptions: {
    ignored: /node_modules|dist|\.js/g
  },

  resolve: {
    extensions: ['.js', '.json'],
    plugins: []
  }
}

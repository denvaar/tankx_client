const path = require('path')
const config = require('./src/config')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    host: config.clientHost
  },
  resolve: {
    extensions: ['.mjs', '.js']
  },
  module: {
    rules: [
      {
        test: /\.js?|\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}

const path = require('path')
const config = require('./src/utils/config')

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
    extensions: ['.mjs', '.js'],
    alias: {
      '@assets': path.resolve(__dirname, 'assets'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@game_objects': path.resolve(__dirname, 'src/game_objects'),
      '@scenes': path.resolve(__dirname, 'src/scenes')
    }
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

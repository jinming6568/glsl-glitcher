const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    open: true,
    overlay: true,
    port: 2020,
    proxy: {
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'API_DOMAIN': JSON.stringify('')
      }
    })
  ]
})

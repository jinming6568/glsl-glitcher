const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const webpackBundleAnalyzer = require('webpack-bundle-analyzer')
const merge = require('webpack-merge')
const commonWebpackConfig = require('./webpack.common.js')

const webpackConfig = merge(commonWebpackConfig, {
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '//ryanbay.cn/vipstyle/video-filter/'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
      }
    })
  ]
})

if (process.env.npm_config_report) {
  webpackConfig.plugins.push(new webpackBundleAnalyzer.BundleAnalyzerPlugin())
}

module.exports = webpackConfig

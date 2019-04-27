const utils = require('./build/utils')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash:7].js')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /zepto\.min\.js$/,
        use: ['exports-loader?window.Zepto', 'script-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src/')
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /\.(mp4)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }]
      },
	    {
		    test: /\.glsl$/,
		    loader: 'webpack-glsl-loader'
	    }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash:7].css')
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['index', 'act']
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: './static/',
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['vendor', 'index'],
      inject: true,
      minify: {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: function (text, inline) {
          let options = {
            'presets': [
              ['env', {'modules': false}]
            ]
          }
          let babel = require('babel-core')
          let gulifyJS = require('uglify-js')
          let res = babel.transform(text, options).code
          return gulifyJS.minify(res).code
        }, // 压缩页面JS
        minifyCSS: true, // 压缩页面CSS
        processScripts: ['text/html'],
        ignoreCustomFragments: [ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/ ],
      }
    })
  ]
}

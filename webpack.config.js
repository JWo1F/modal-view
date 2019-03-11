const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 2345,
    disableHostCheck: true,
    host: '0.0.0.0',
    historyApiFallback: {
      index: '/'
    }
  },
  resolve: {
    alias: {
      $editorCommon: path.resolve(__dirname, 'src/editor/common'),
      $root: path.resolve(__dirname, 'src'),
      $panel: path.resolve(__dirname, 'src/panel'),
      $editor: path.resolve(__dirname, 'src/editor'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.NODE_ENV': '"development"'
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(woff|png|jpg)$/,
        use: 'url-loader'
      },
      {
        test: /\.styl$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[path]--[local]'
            }
          },
          'postcss-loader',
          {
            loader: 'stylus-loader',
            options: {
              paths: 'scripts'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};
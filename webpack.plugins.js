const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack')


module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [{ from: path.resolve(__dirname, 'src/assets/'), to: 'assets/'}]
  }),
  new webpack.DefinePlugin({
    "process.env": "{}"
  }),
  new webpack.ExternalsPlugin('commmonjs', [
    'electron'
  ])
];

const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(process.cwd(), 'dist'),
    hot: true,
    historyApiFallback: true, 
    compress: true,
    liveReload: false,
    writeToDisk: true,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
});

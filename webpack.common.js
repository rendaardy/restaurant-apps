const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-webpack-plugin');

module.exports = {
  entry: { 
    index: path.resolve(process.cwd(), 'src/scripts/index.ts'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
  },
  plugins: [
    new IgnoreNotFoundExportPlugin({
      include: [/\.ts$/],
    }),
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), 'src', 'templates', 'index.html'),
      filename: 'index.html',
      favicon: path.join(process.cwd(), 'src', 'public', 'favicon.ico'),
    }),
    new WebpackPwaManifest({
      name: 'Megabucket',
      short_name: 'Megabucket',
      description: 'Find the best restaurant near you',
      theme_color: '#eeebdd',
      background_color: '#eeebdd',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      inject: true,
      ios: true,
      icons: [
        {
          src: path.resolve('src', 'icons', 'maskable_icon_x512.png'),
          sizes: [48, 72, 96, 128, 192, 384, 512],
          purpose: 'maskable',
          destination: path.join('images', 'icons'),
          ios: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), 'src/public/'),
          to: path.resolve(process.cwd(), 'dist/'),
        },
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g)/,
          options: {
            quality: 50,
          },
        },
      ],
      overrideExtension: true,
    }),   
    new WorkboxPlugin.InjectManifest({
      swSrc: path.join(process.cwd(), 'src', 'scripts', 'service-worker.ts'),
    }),
  ],
};

const path = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  externals: {
    jquery: 'jQuery'
  },
  entry: './src/index.ts',
  output: {
    filename: 'universal-search.js',
    path: path.resolve(__dirname, 'demo')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {

      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './demo'
            }
          },
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'universal-search.css'
    }),
    new OptimizeCSSAssetsPlugin({})
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false
      })
    ]
  },
  devServer: {
    contentBase: './demo'
  },
};

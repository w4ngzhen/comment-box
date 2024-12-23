const path = require('node:path');
const rspack = require('@rspack/core');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    filename: 'comment-box-lite.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'CommentBoxLite',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?/,
        use: ['babel-loader'],
        exclude: /node_moudles/,
      },
      {
        test: /\.css$/,
        use: [rspack.CssExtractRspackPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, 'example', 'index.html'),
      inject: false,
    }),
    new rspack.CssExtractRspackPlugin({
      filename: 'comment-box-lite.css',
    }),
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0',
  },
};

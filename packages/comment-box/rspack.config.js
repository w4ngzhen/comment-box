const path = require('node:path');
const rspack = require('@rspack/core');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    filename: 'comment-box.js',
    path: path.resolve(__dirname, 'dist'),
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
            options: {
              lessOptions: {
                modifyVars: {
                  // 会应用到shared里面的less @prefix 变量
                  prefix: 'comment-box',
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
    new rspack.CssExtractRspackPlugin({
      filename: 'comment-box.css',
    }),
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0',
  },
};

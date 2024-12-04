const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const optimizeConfig = () => {
  if (process.env.mode === 'production') {
    return {
      minimize: true,
    };
  } else {
    return {
      minimize: false,
    };
  }
};

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
        test: /\.tsx?/,
        use: ['babel-loader'],
        exclude: /node_moudles/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'comment-box.css',
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 7777, // 包体积分析用7777端口呈现
    }),
  ],
  optimization: optimizeConfig(),
  devServer: {
    port: 8080,
    host: '0.0.0.0',
  },
};

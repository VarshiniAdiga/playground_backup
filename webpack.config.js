const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require("path");

const devServerPort = 3000;

const webpackConfig = {
  target: 'web',
  devtool: 'source-map',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, 
        use: {
          loader: "ts-loader"
        },
        exclude: [ path.resolve('./types'), path.resolve('./node_modules') ],
      },
      {
        test:/\.css$/,
        use:['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|ttf|woff2?)(\?.*)?$/i,
        use: {
          loader: 'url-loader?limit=100000'
        }
      },
      {
        test: /\.d\.ts$/i,
        use: "raw-loader",
      },
    ],
    // TO FIX: Disable critical dependency warning
    exprContextCritical: false
  },
  stats: {
    errorDetails: true,
    colors: false,
    modules: false,
    reasons: true
  },
  optimization: {
    splitChunks: {
        cacheGroups: {
            monacoCommon: {
                test: /[\\/]node_modules[\\/]monaco\-editor/,
                name: 'monaco-editor-common',
                chunks: 'async'
            }
        }
    }
  },
  plugins: [
    new NodePolyfillPlugin(),
    new MonacoEditorWebpackPlugin({
      languages: [ "javascript", "typescript", "css", "html", "json" ]
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {
          template: path.join(__dirname, "src", "index.html"),
          filename: './index.html',
          scriptLoading: 'defer'
        }
      )
    )
  ],
  devServer: {
    port: devServerPort,
    host: 'localhost',
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true
  }
};

module.exports = webpackConfig;

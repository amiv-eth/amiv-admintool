const publicPath = '/dist';

const path = require('path');
const webpack = require('webpack');

const config = {
  context: `${__dirname}/src`, // `__dirname` is root of project

  entry: './index.js',

  output: {
    path: `${__dirname}/dist`, // `dist` is the destination
    filename: 'bundle.js',
  },

  // To run development server
  devServer: {
    contentBase: __dirname,
    publicPath,
    compress: true,
    port: 9000,
    hot: true,
    index: 'index.html',
    historyApiFallback: {
      index: 'index.html',
    },
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/, // Check for all js files
        include: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, 'node_modules/@material'),
          path.resolve(__dirname, 'node_modules/amiv-web-ui-components'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'last 2 years' }]],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath,
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Dynamically include config
  resolve: {
    alias: {
      networkConfig: `${__dirname}/src/networkConfig.json`,
    },
  },

  devtool: 'eval-source-map', // Default development sourcemap
};

module.exports = config;

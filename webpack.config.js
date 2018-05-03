const publicPath = '/dist';

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
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true // don't fail the build for linting errors
        }
      },
      {
        test: /\.js$/, // Check for all js files
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-object-rest-spread'],
          },
        }],
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
        test: /node_modules\/announcetool.*\.(html|css)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath,
            },
          },
        ],
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

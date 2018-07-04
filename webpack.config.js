const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const { DefinePlugin, HotModuleReplacementPlugin, optimize } = webpack;
const { UglifyJsPlugin, CommonsChunkPlugin } = optimize;

const { NODE_ENV } = process.env;

const config = {
  entry: {
    vendors: ['react', 'react-dom', 'typed.js'],
    script: [`${__dirname}/client/index.tsx`],
  },
  output: {
    path: path.join(__dirname, 'public/bundle'),
    filename: '[name].js',
    publicPath: '/bundle',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.gql',
      '.graphql',
    ],
    plugins: [new TsConfigPathsPlugin()],
  },
  module: {
    rules: [{
      test: /\.scss$/,
      exclude: /(node_modules|bower_components)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: NODE_ENV === 'production' ? '[hash:base64]' : '[local]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => ([
              autoprefixer({
                browsers: ['last 2 versions', 'last 2 Chrome versions', 'ie >= 9']
              })
            ]),
          },
        }, {
          loader: 'sass-loader'
        }],
      }),
    }, {
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
    }, {
      enforce: 'pre',
      test: /\.tsx?$/,
      loader: 'source-map-loader',
    }, {
      test: /\.tsx?$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      options: {
        emitErrors: true,
        typeCheck: true,
        formatter: 'codeFrame',
      },
    }, {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }],
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV || 'development'),
      },
    }),
    new ExtractTextPlugin('style.css'),
    new CommonsChunkPlugin({ names: 'vendors' }),
  ],
};

if (NODE_ENV === 'production') {
  config.devtool = 'source-map';
  config.plugins.push(
    new UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: true,
      },
      output: { comments: false },
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: {
        discardComments: { removeAll: true },
      },
    })
  );
} else {
  config.devtool = 'eval-cheap-module-source-map';
  config.entry.script.unshift('webpack-hot-middleware/client');
  config.plugins.push(new HotModuleReplacementPlugin());
}

module.exports = config;

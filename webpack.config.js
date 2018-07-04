const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const autoprefixer = require('autoprefixer');
const tsconfig = require('./tsconfig.json');

const { DefinePlugin, HotModuleReplacementPlugin, optimize } = webpack;
const { UglifyJsPlugin, CommonsChunkPlugin } = optimize;

const { NODE_ENV } = process.env;

const CACHE_LOADER = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: path.resolve('.cache/webpack'),
  }
};

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
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'graphql-tag/loader',
      }],
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'thread-loader',
      }, {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
        }
      }],
    }],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV || 'development'),
      },
    }),
    new ExtractTextPlugin('style.css'),
    new CommonsChunkPlugin({ names: 'vendors' }),
  ],
};

// resolve paths from tsconfig
Object.keys(tsconfig.compilerOptions.paths).forEach(k => {
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  const key = k.replace(/\/(\*)+/, '');
  const value = tsconfig.compilerOptions.paths[k][0].replace(/\/(\*)+/, '');
  config.resolve.alias[key] = path.resolve(__dirname, value);
});

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

  // only do tslint for non-prod
  config.module.rules.push({
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: 'tslint-loader',
    options: {
      emitErrors: true,
      typeCheck: true,
      formatter: 'codeFrame',
    },
  });

  // only do cache for non-prod
  for (let i = 0; i < config.module.rules.length; i++) {
    if (config.module.rules[i].use) {
      config.module.rules[i].use.unshift(CACHE_LOADER);
    }
  }
}

module.exports = config;

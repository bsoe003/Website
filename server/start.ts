import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { each as parallel } from 'async';

import LocalLogger from './LocalLogger';

type Cache = { maxAge?: number };

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

// define constants
const CF_APP_ENV = require('cfenv').getAppEnv();
const NODE_ENV: string = process.env.NODE_ENV || Environment.DEVELOPMENT;
const PORT: number = parseInt(CF_APP_ENV.port || '3000', 10);
const CACHE_CONTROL: Cache = {};
const ROOT_PATH: string = path.resolve(`${__dirname}/..`);
const API_DIRECTORY = 'data';
const API_FILES: Set<string> = new Set();

// functions and object used for configuration
const app: express.Application = express();
const middlewares: Array<Function> = [];
const logger: LocalLogger = new LocalLogger({ timed: true });
const parser = {
  body: require('body-parser'),
  cookie: require('cookie-parser'),
};

if (NODE_ENV !== Environment.DEVELOPMENT) {
  // cache files when not in development
  app.set('view cache', true);
  middlewares.push(require('compression')());
  CACHE_CONTROL.maxAge = 2592000000;
}

if (NODE_ENV === Environment.DEVELOPMENT) {
  // webpack wrapper object
  const webpack = {
    call: require('webpack'),
    config: require(`${ROOT_PATH}/webpack.config.js`),
    middleware: {
      dev: require('webpack-dev-middleware'),
      hot: require('webpack-hot-middleware'),
    },
  };
  const compiler = webpack.call(webpack.config);

  // let express know to watch any changes from webpack (or client files)
  middlewares.push(webpack.middleware.dev(compiler, {
    noInfo: true,
    publicPath: webpack.config.output.publicPath,
    stats: 'errors-only',
  }));
  middlewares.push(webpack.middleware.hot(compiler));
}

// default middleware configurations
middlewares.push(express.static(`${ROOT_PATH}/public`, CACHE_CONTROL));
middlewares.push(parser.cookie());
middlewares.push(parser.body.urlencoded({ extended: false }));
middlewares.push(parser.body.json());

app.all('/api', logger.middleware);

// apply middlewares in "parallel"
app.use((req, res, next) => {
  parallel(middlewares, (mw, cb) => {
    mw(req, res, cb);
  }, next); // tslint:disable-line:align
});

// resume endpoint
app.get('/resume', (req, res) => {
  res.sendFile(`${ROOT_PATH}/public/resume.pdf`);
});

// let React app handle not defined express routes.
app.get('*', (req, res) => {
  res.sendFile(`${ROOT_PATH}/public/index.html`);
});

// start app
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Environment: ${NODE_ENV.toUpperCase()}`);
  logger.info(`Application started at ${PORT}`);
  if (NODE_ENV === Environment.DEVELOPMENT) {
    logger.info('Building with Webpack ...');
  }
});

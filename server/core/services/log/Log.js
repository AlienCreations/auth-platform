'use strict';

const R      = require('ramda'),
      config = require('config');

const Log = require('@aliencreations/node-logger')({ appName : config.serviceName }, R.path(['logger', 'pino'], config));

module.exports = meta => Log.child(meta);

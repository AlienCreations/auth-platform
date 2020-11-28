'use strict';

const config = require('config');

const Monitor = require('@aliencreations/node-monitor')(config.monitor.strategy);

module.exports = (req, res, next) => {
  req.monitor = Monitor;
  next();
};

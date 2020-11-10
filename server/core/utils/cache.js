'use strict';

const R           = require('ramda'),
      config      = require('config'),
      redisConfig = R.prop(R.__, R.prop('redis', config)),
      redis       = require(redisConfig('client')),
      redisClient = redis.createClient(Number(redisConfig('port')), redisConfig('host'), redisConfig('options')),
      cacheUtils  = require('alien-node-redis-utils')(redisClient);

cacheUtils.logger = require('../services/log/Log')({});

redisClient.auth(redisConfig('password'));
redisClient.on('error', err => cacheUtils.logger.fatal({ err, stack : err.stack }));

module.exports = cacheUtils;

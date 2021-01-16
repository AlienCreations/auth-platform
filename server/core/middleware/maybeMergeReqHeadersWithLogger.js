'use strict';

module.exports = (req, res, next) => {
  req.logger = require('../services/log/Log')({
    requestId    : req.get('x-request-id'),
    forwardedFor : req.get('x-forwarded-for'),
    realIp       : req.get('x-real-ip'),
    trueIp       : req.get('true-client-ip')
  });
  if (process.env.ALLOW_DEBUG === 'true') {
    req.logger.debug({ headers : req.headers });
  }

  next();
};

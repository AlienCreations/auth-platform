'use strict';

const config            = require('config');
const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const cache = require('../../utils/cache');

const logout = (req, res) => {
  if (req.body.refreshToken) {
    authenticator.deleteRefreshToken(cache)(req.body.refreshToken);
  }
  if (req.logout) {
    req.logout();
  }
  res.send('ok');
};

module.exports = logout;

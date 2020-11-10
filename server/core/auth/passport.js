'use strict';

const passport = require('passport'),
      config   = require('config');

const init = () => {
  config.auth.userStrategies.map(strategy => {
    passport.use(strategy, require('./strategies/' + strategy));
  });

  return passport;
};

module.exports = { init };

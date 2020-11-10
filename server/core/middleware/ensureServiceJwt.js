'use strict';

const R                 = require('ramda'),
      { error, errors } = require('@aliencreations/node-error');

const SERVICE_STRATEGY = 'service';

const ensureServiceJwt = (req, _res, next) => {
  const strategy = R.path(['user', 'strategy'])(req);
  const { user } = req;

  if (strategy === SERVICE_STRATEGY) {
    next();
  } else {
    next(error(
      errors.auth.FORBIDDEN_API_ACCESS({
        debug : { user }
      })
    ));
  }
};

module.exports = ensureServiceJwt;

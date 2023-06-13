'use strict';

const R = require('ramda');

const { errors } = require('@aliencreations/node-error');

const scrubErrorForBrowser = (err, req) => {
  let responseError;

  const shouldSeeFullError = R.pathEq('service', ['user', 'strategy'])(req) || process.env.ALLOW_DEBUG === 'true';
  const scrubForBrowser    = R.omit(['debug']);

  if (err.isInternalError) {
    if (shouldSeeFullError) {
      responseError = err;
    } else {
      responseError = scrubForBrowser(err);
    }
  } else {
    if (shouldSeeFullError) {
      responseError = errors.system.UNCAUGHT({
        debug : {
          originalError : err
        }
      });
    } else {
      responseError = scrubForBrowser(errors.system.UNCAUGHT());
    }
  }

  return responseError;
};


module.exports = {
  scrubErrorForBrowser
};

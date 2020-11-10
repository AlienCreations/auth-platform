'use strict';

const R = require('ramda');

const handleServiceResponse = R.curry(({ logger }, context, response) => {
  /* istanbul ignore next */
  if (process.env.ALLOW_DEBUG === 'true') {
    logger.info({ msg : context, response : response.data });
  }
  return response.data;
});

const handleHttpServiceErrorWithThrow = R.curry(({ logger }, context, err) => {
  logger.error({ msg : `Error: ${context}`, err });
  throw err;
});

module.exports = {
  handleServiceResponse,
  handleHttpServiceErrorWithThrow : handleHttpServiceErrorWithThrow
};

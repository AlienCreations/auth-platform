'use strict';

const config = require('config'),
      R      = require('ramda');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const validateTransferTokenData = require('./helpers/validateTransferTokenData').validateForCreate;

/**
 * Create a new transfer token so users can jump from one Go app to another while persisting their
 * auth session.
 * @param {Object} data
 */
const createTransferToken = ({ cache }) => data => Promise.resolve(data)
  .then(validateTransferTokenData)
  .then(() => data)
  .then(authenticator.generateAndCacheTransferToken(cache))
  .then(R.objOf('transferToken'));

module.exports = createTransferToken;

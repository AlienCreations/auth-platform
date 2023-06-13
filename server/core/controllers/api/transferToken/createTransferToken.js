'use strict';

const config = require('config'),
      R      = require('ramda');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const validateTransferTokenData = require('./helpers/validateTransferTokenData').validateForCreate;

const createTransferToken = ({ cache }) => data => Promise.resolve(data)
  .then(validateTransferTokenData)
  .then(() => data)
  .then(authenticator.generateAndCacheTransferToken(cache))
  .then(R.objOf('transferToken'));

module.exports = createTransferToken;

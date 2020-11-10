'use strict';

const R             = require('ramda'),
      config        = require('config');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getPasswordResetByToken = require('../../../models/passwordReset/methods/getPasswordResetByToken');

/**
 * Fetch passwordReset by associated token from the database
 * @param {String} token
 */
const getPasswordResetByToken = token => {
  return Promise.resolve(token)
    .then(authenticator.urlBase64Decode)
    .then(_getPasswordResetByToken)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = getPasswordResetByToken;

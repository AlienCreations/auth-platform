'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getProspectUserByEmailAndToken = require('../../../models/prospectUser/methods/getProspectUserByEmailAndToken');

/**
 * Get a prospectUser by his/her email from the database
 * @param {String} email
 * @param {String} token
 */
const getProspectUserByEmailAndToken = (email, token) => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve()
    .then(() => _getProspectUserByEmailAndToken(email, token))
    .then(R.omit(privateFields));
};

module.exports = getProspectUserByEmailAndToken;

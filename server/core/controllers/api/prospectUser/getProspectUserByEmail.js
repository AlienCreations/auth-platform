'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getProspectUserByEmail = require('../../../models/prospectUser/methods/getProspectUserByEmail');

const getProspectUserByEmail = email => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve(R.defaultTo(undefined, email))
    .then(_getProspectUserByEmail)
    .then(R.omit(privateFields));
};

module.exports = getProspectUserByEmail;

'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getProspectUserById = require('../../../models/prospectUser/methods/getProspectUserById');

/**
 * Get a prospectUser by his/her id from the database
 * @param {Number} id
 */
const getProspectUserById = id => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve(id)
    .then(_getProspectUserById)
    .then(R.omit(privateFields));
};

module.exports = getProspectUserById;

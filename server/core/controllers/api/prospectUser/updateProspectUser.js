'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateProspectUser = require('../../../models/prospectUser/methods/updateProspectUser'),
      getProspectUserById = require('../../../models/prospectUser/methods/getProspectUserById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS)
);

/**
 * Update a prospectUser record
 * @param {Object} prospectUserData
 * @param {Number} id
 */
const updateProspectUser = (prospectUserData, id) => {
  return Promise.resolve(prospectUserData)
    .then(_updateProspectUser(id))
    .then(R.always(id))
    .then(getProspectUserById)
    .then(R.omit(privateFields));
};

module.exports = updateProspectUser;

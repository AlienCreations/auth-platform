'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateProspectUser   = require('../../../models/prospectUser/methods/updateProspectUser'),
      getProspectUserByUuid = require('../../../models/prospectUser/methods/getProspectUserByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS)
);

const updateProspectUser = (prospectUserData, uuid) => {
  return Promise.resolve(prospectUserData)
    .then(_updateProspectUser(uuid))
    .then(R.always(uuid))
    .then(getProspectUserByUuid)
    .then(R.omit(privateFields));
};

module.exports = updateProspectUser;

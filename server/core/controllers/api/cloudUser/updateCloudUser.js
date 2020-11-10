'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateCloudUser       = require('../../../models/cloudUser/methods/updateCloudUser'),
      getCloudUserById       = require('../../../models/cloudUser/methods/getCloudUserById'),
      maybeConvertJsonFields = require('../_helpers/maybeConvertJsonFields');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS)
);

const JSON_FIELDS = ['permissionsJson', 'strategyRefs', 'authConfig', 'metaJson'];

/**
 * Update a cloudUser record
 * @param {Object} cloudUserData
 * @param {Number} id
 */
const updateCloudUser = (cloudUserData, id) => {
  return Promise.resolve(cloudUserData)
    .then(maybeConvertJsonFields.stringify(JSON_FIELDS))
    .then(_updateCloudUser(id))
    .then(R.always(id))
    .then(getCloudUserById)
    .then(maybeConvertJsonFields.parse(JSON_FIELDS))
    .then(R.omit(privateFields));
};

module.exports = updateCloudUser;

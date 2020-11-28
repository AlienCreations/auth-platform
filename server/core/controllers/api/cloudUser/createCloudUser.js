'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config),
      PRIVATE_FIELDS        = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const _createCloudUser       = require('../../../models/cloudUser/methods/createCloudUser'),
      getCloudUserById       = require('../../../models/cloudUser/methods/getCloudUserById'),
      maybeConvertJsonFields = require('../_helpers/maybeConvertJsonFields');

const JSON_FIELDS = ['strategyRefs', 'authConfig', 'metaJson'];

/**
 * Create a new cloudUser record
 * @param {Object} cloudUserData
 */
const createCloudUser = cloudUserData => {
  return Promise.resolve(cloudUserData)
    .then(_createCloudUser)
    .then(R.prop('insertId'))
    .then(getCloudUserById)
    .then(maybeConvertJsonFields.parse(JSON_FIELDS))
    .then(R.omit(PRIVATE_FIELDS));
};

module.exports = createCloudUser;

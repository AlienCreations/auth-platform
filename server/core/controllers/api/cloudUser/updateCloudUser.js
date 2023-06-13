'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateCloudUser       = require('../../../models/cloudUser/methods/updateCloudUser'),
      getCloudUserByUuid     = require('../../../models/cloudUser/methods/getCloudUserByUuid'),
      maybeConvertJsonFields = require('../_helpers/maybeConvertJsonFields');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS)
);

const JSON_FIELDS = ['strategyRefs', 'authConfig', 'metaJson'];

const updateCloudUser = (cloudUserData, uuid) => {
  return Promise.resolve(cloudUserData)
    .then(maybeConvertJsonFields.stringify(JSON_FIELDS))
    .then(_updateCloudUser(uuid))
    .then(R.always(uuid))
    .then(getCloudUserByUuid)
    .then(maybeConvertJsonFields.parse(JSON_FIELDS))
    .then(R.omit(privateFields));
};

module.exports = updateCloudUser;

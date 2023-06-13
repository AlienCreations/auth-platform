'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getCloudUsersByUuids  = require('../../../models/cloudUser/methods/getCloudUsersByUuids'),
      maybeConvertJsonFields = require('../_helpers/maybeConvertJsonFields');

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS),
      JSON_FIELDS   = ['strategyRefs', 'authConfig', 'metaJson'];

const getCloudUsersByUuids = cloudUserUuids => Promise.resolve(cloudUserUuids)
  .then(R.unless(R.isEmpty, _getCloudUsersByUuids))
  .then(R.map(R.compose(
    R.omit(privateFields),
    maybeConvertJsonFields.parse(JSON_FIELDS)
  )));

module.exports = getCloudUsersByUuids;

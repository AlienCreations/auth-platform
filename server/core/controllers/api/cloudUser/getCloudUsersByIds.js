'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getCloudUsersByIds    = require('../../../models/cloudUser/methods/getCloudUsersByIds'),
      maybeConvertJsonFields = require('../_helpers/maybeConvertJsonFields');

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS),
      JSON_FIELDS   = ['permissionsJson', 'strategyRefs', 'authConfig', 'metaJson'];

/**
 * Get an array of cloudUser by ids from the database
 * @param {Array} cloudUserIds
 */
const getCloudUsersByIds = cloudUserIds => Promise.resolve(cloudUserIds)
  .then(R.unless(R.isEmpty, _getCloudUsersByIds))
  .then(R.map(R.compose(
    R.omit(privateFields),
    maybeConvertJsonFields.parse(JSON_FIELDS)
  )));

module.exports = getCloudUsersByIds;

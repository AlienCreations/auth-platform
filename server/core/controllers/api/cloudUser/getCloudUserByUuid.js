'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getCloudUserByUuid = require('../../../models/cloudUser/methods/getCloudUserByUuid'),
      maybeJsonParse      = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['strategyRefs', 'authConfig', 'metaJson']);

const getCloudUserByUuid = uuid => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve(uuid)
    .then(_getCloudUserByUuid)
    .then(R.omit(privateFields))
    .then(maybeParseJson);
};

module.exports = getCloudUserByUuid;

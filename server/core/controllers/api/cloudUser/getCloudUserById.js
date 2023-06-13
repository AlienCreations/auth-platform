'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getCloudUserById = require('../../../models/cloudUser/methods/getCloudUserById'),
      maybeJsonParse    = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['strategyRefs', 'authConfig', 'metaJson']);

const getCloudUserById = id => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve(id)
    .then(_getCloudUserById)
    .then(R.omit(privateFields))
    .then(maybeParseJson);
};

module.exports = getCloudUserById;

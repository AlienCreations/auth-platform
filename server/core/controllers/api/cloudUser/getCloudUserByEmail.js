'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getCloudUserByEmail = require('../../../models/cloudUser/methods/getCloudUserByEmail'),
      maybeJsonParse       = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['strategyRefs', 'authConfig', 'metaJson']);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const getCloudUserByEmail = email => Promise.resolve(R.defaultTo(undefined, email))
  .then(_getCloudUserByEmail)
  .then(R.omit(privateFields))
  .then(maybeParseJson);

module.exports = getCloudUserByEmail;

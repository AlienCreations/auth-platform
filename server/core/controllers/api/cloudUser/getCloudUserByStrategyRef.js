'use strict';

const R      = require('ramda'),
      config = require('config');

const _getCloudUserByStrategyRef = require('../../../models/cloudUser/methods/getCloudUserByStrategyRef'),
      maybeJsonParse             = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['strategyRefs', 'authConfig', 'metaJson']);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const getCloudUserByStrategyRef = (strategy, id) => Promise.resolve(id)
  .then(_getCloudUserByStrategyRef(strategy))
  .then(R.omit(privateFields))
  .then(maybeParseJson);

module.exports = getCloudUserByStrategyRef;

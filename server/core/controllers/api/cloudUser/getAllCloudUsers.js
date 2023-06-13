'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS     = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      CLOUD_USER_PRIVATE_FIELDS = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, CLOUD_USER_PRIVATE_FIELDS);

const _getAllCloudUsers = require('../../../models/cloudUser/methods/getAllCloudUsers'),
      maybeJsonParse    = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['strategyRefs', 'authConfig', 'metaJson']);

const getAllCloudUsers = () => Promise.resolve()
  .then(_getAllCloudUsers)
  .then(R.map(R.compose(
    R.omit(privateFields),
    maybeParseJson
  )));

module.exports = getAllCloudUsers;

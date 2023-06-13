'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const _getTenantConnectionByUuid = require('../../../models/tenantConnection/methods/getTenantConnectionByUuid'),
      maybeJsonParse             = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

const getTenantConnectionByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantConnectionByUuid)
  .then(maybeParseJson)
  .then(R.omit(privateFields));

module.exports = getTenantConnectionByUuid;

'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const _getTenantConnectionsByTenantUuid = require('../../../models/tenantConnection/methods/getTenantConnectionsByTenantUuid'),
      maybeJsonParse                    = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

const getTenantConnectionsByTenantUuid = tenantUuid => Promise.resolve(tenantUuid)
  .then(_getTenantConnectionsByTenantUuid)
  .then(R.map(R.compose(
    maybeParseJson,
    R.omit(privateFields))
  ));

module.exports = getTenantConnectionsByTenantUuid;

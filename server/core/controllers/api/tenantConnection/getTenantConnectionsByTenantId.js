'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const _getTenantConnectionsByTenantId = require('../../../models/tenantConnection/methods/getTenantConnectionsByTenantId'),
      maybeJsonParse                  = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

/**
 * Get all connections by tenantId from the database
 * @param {Number} tenantId
 */
const getTenantConnectionsByTenantId = tenantId => Promise.resolve(tenantId)
  .then(_getTenantConnectionsByTenantId)
  .then(R.map(R.compose(
    maybeParseJson,
    R.omit(privateFields))
  ));

module.exports = getTenantConnectionsByTenantId;

'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationsByTenantId = require('../../../models/tenantOrganization/methods/getTenantOrganizationsByTenantId'),
      maybeJsonParse                    = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

/**
 * Get all organizations by tenantId from the database
 * @param {Number} tenantId
 */
const getTenantOrganizationsByTenantId = tenantId => Promise.resolve(tenantId)
  .then(_getTenantOrganizationsByTenantId)
  .then(R.map(R.compose(
    maybeParseJson,
    R.omit(privateFields))
  ));

module.exports = getTenantOrganizationsByTenantId;

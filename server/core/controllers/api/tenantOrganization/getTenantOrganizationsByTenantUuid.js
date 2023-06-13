'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationsByTenantUuid = require('../../../models/tenantOrganization/methods/getTenantOrganizationsByTenantUuid'),
      maybeJsonParse                      = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

const getTenantOrganizationsByTenantUuid = tenantUuid => Promise.resolve(tenantUuid)
  .then(_getTenantOrganizationsByTenantUuid)
  .then(R.map(R.compose(
    maybeParseJson,
    R.omit(privateFields))
  ));

module.exports = getTenantOrganizationsByTenantUuid;

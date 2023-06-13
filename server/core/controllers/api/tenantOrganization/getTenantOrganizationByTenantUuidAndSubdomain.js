'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationByTenantUuidAndSubdomain = require('../../../models/tenantOrganization/methods/getTenantOrganizationByTenantUuidAndSubdomain'),
      maybeJsonParse                                 = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

const getTenantOrganizationByTenantUuidAndSubdomain = (tenantUuid, subdomain) => {
  return Promise.resolve()
    .then(() => _getTenantOrganizationByTenantUuidAndSubdomain(tenantUuid, subdomain))
    .then(maybeParseJson)
    .then(R.omit(privateFields));
};

module.exports = getTenantOrganizationByTenantUuidAndSubdomain;

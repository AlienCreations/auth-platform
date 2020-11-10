'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationByTenantIdAndSubdomain = require('../../../models/tenantOrganization/methods/getTenantOrganizationByTenantIdAndSubdomain'),
      maybeJsonParse                               = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

/**
 * Get a tenantOrganization by tenantId and subdomain from the database
 * @param {Number} tenantId
 * @param {String} subdomain
 */
const getTenantOrganizationByTenantIdAndSubdomain = (tenantId, subdomain) => {
  return Promise.resolve()
    .then(() => _getTenantOrganizationByTenantIdAndSubdomain(tenantId, subdomain))
    .then(maybeParseJson)
    .then(R.omit(privateFields));
};

module.exports = getTenantOrganizationByTenantIdAndSubdomain;

'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantOrganization   = require('../../../models/tenantOrganization/methods/updateTenantOrganization'),
      getTenantOrganizationByUuid = require('../../../models/tenantOrganization/methods/getTenantOrganizationByUuid');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const metaJsonLens       = R.lensProp('metaJson');
const maybeStringifyJson = R.when(R.has('metaJson'), R.over(metaJsonLens, JSON.stringify));

const updateTenantOrganization = (tenantOrganizationData, uuid) => {
  return Promise.resolve(tenantOrganizationData)
    .then(maybeStringifyJson)
    .then(_updateTenantOrganization(uuid))
    .then(R.always(uuid))
    .then(getTenantOrganizationByUuid)
    .then(R.omit(privateFields));
};

module.exports = updateTenantOrganization;

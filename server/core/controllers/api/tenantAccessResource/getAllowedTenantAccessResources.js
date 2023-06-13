'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getAllowedTenantAccessResources = require('../../../models/tenantAccessResource/methods/getAllowedTenantAccessResources');

const getAllowedTenantAccessResources = (tenantUuid, tenantOrganizationUuid) => {
  return Promise.resolve()
    .then(() => _getAllowedTenantAccessResources(tenantUuid, tenantOrganizationUuid))
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getAllowedTenantAccessResources;

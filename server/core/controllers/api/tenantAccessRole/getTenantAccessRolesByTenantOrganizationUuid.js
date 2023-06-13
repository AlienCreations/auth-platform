'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRolesByTenantOrganizationUuid = require('../../../models/tenantAccessRole/methods/getTenantAccessRolesByTenantOrganizationUuid');

const getTenantAccessRolesByTenantOrganizationUuid = tenantOrganizationUuid => {
  return Promise.resolve(tenantOrganizationUuid)
    .then(_getTenantAccessRolesByTenantOrganizationUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRolesByTenantOrganizationUuid;

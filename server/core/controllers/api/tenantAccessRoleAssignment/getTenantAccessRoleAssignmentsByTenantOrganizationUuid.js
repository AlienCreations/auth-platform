'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByTenantOrganizationUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantOrganizationUuid');

const getTenantAccessRoleAssignmentsByTenantOrganizationUuid = tenantOrganizationUuid => {
  return Promise.resolve(tenantOrganizationUuid)
    .then(_getTenantAccessRoleAssignmentsByTenantOrganizationUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByTenantOrganizationUuid;

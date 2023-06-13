'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByTenantAccessRoleUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantAccessRoleUuid');

const getTenantAccessRoleAssignmentsByTenantAccessRoleUuid = tenantAccessRoleUuid => {
  return Promise.resolve(tenantAccessRoleUuid)
    .then(_getTenantAccessRoleAssignmentsByTenantAccessRoleUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByTenantAccessRoleUuid;

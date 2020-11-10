'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByTenantAccessRoleId = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantAccessRoleId');

/**
 * Get all access role assignments under a tenant from the database
 * @param {Number} tenantAccessRoleId
 */
const getTenantAccessRoleAssignmentsByTenantAccessRoleId = tenantAccessRoleId => {
  return Promise.resolve(tenantAccessRoleId)
    .then(_getTenantAccessRoleAssignmentsByTenantAccessRoleId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByTenantAccessRoleId;

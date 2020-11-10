'use strict';

module.exports = {
  createTenantAccessRoleAssignment                     : require('./methods/createTenantAccessRoleAssignment'),
  deleteTenantAccessRoleAssignment                     : require('./methods/deleteTenantAccessRoleAssignment'),
  deleteTenantAccessRoleAssignmentsByCloudUserId       : require('./methods/deleteTenantAccessRoleAssignmentsByCloudUserId'),
  getTenantAccessRoleAssignmentById                    : require('./methods/getTenantAccessRoleAssignmentById'),
  getTenantAccessRoleAssignmentsByTenantAccessRoleId   : require('./methods/getTenantAccessRoleAssignmentsByTenantAccessRoleId'),
  getTenantAccessRoleAssignmentsByCloudUserId          : require('./methods/getTenantAccessRoleAssignmentsByCloudUserId'),
  getTenantAccessRoleAssignmentsByTenantOrganizationId : require('./methods/getTenantAccessRoleAssignmentsByTenantOrganizationId'),
  updateTenantAccessRoleAssignment                     : require('./methods/updateTenantAccessRoleAssignment')
};

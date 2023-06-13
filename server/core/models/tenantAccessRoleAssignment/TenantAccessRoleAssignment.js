'use strict';

module.exports = {
  createTenantAccessRoleAssignment                       : require('./methods/createTenantAccessRoleAssignment'),
  deleteTenantAccessRoleAssignment                       : require('./methods/deleteTenantAccessRoleAssignment'),
  getTenantAccessRoleAssignmentById                      : require('./methods/getTenantAccessRoleAssignmentById'),
  getTenantAccessRoleAssignmentByUuid                    : require('./methods/getTenantAccessRoleAssignmentByUuid'),
  deleteTenantAccessRoleAssignmentsByCloudUserUuid       : require('./methods/deleteTenantAccessRoleAssignmentsByCloudUserUuid'),
  getTenantAccessRoleAssignmentsByTenantAccessRoleUuid   : require('./methods/getTenantAccessRoleAssignmentsByTenantAccessRoleUuid'),
  getTenantAccessRoleAssignmentsByCloudUserUuid          : require('./methods/getTenantAccessRoleAssignmentsByCloudUserUuid'),
  getTenantAccessRoleAssignmentsByTenantOrganizationUuid : require('./methods/getTenantAccessRoleAssignmentsByTenantOrganizationUuid'),
  updateTenantAccessRoleAssignment                       : require('./methods/updateTenantAccessRoleAssignment')
};

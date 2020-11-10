'use strict';

module.exports = {
  createTenantAccessPermission                       : require('./methods/createTenantAccessPermission'),
  deleteTenantAccessPermission                       : require('./methods/deleteTenantAccessPermission'),
  getTenantAccessPermissionById                      : require('./methods/getTenantAccessPermissionById'),
  getTenantAccessPermissionsByTenantAccessRoleId     : require('./methods/getTenantAccessPermissionsByTenantAccessRoleId'),
  getTenantAccessPermissionsByTenantAccessResourceId : require('./methods/getTenantAccessPermissionsByTenantAccessResourceId'),
  getTenantAccessPermissionsByTenantOrganizationId   : require('./methods/getTenantAccessPermissionsByTenantOrganizationId'),
  updateTenantAccessPermission                       : require('./methods/updateTenantAccessPermission'),
  checkTenantAccessPermission                        : require('./methods/checkTenantAccessPermission')
};

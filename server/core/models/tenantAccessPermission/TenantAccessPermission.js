'use strict';

module.exports = {
  createTenantAccessPermission                         : require('./methods/createTenantAccessPermission'),
  deleteTenantAccessPermission                         : require('./methods/deleteTenantAccessPermission'),
  getTenantAccessPermissionById                        : require('./methods/getTenantAccessPermissionById'),
  getTenantAccessPermissionByUuid                      : require('./methods/getTenantAccessPermissionByUuid'),
  getTenantAccessPermissionsByTenantAccessRoleUuid     : require('./methods/getTenantAccessPermissionsByTenantAccessRoleUuid'),
  getTenantAccessPermissionsByTenantAccessResourceUuid : require('./methods/getTenantAccessPermissionsByTenantAccessResourceUuid'),
  getTenantAccessPermissionsByTenantOrganizationUuid   : require('./methods/getTenantAccessPermissionsByTenantOrganizationUuid'),
  updateTenantAccessPermission                         : require('./methods/updateTenantAccessPermission'),
  checkTenantAccessPermission                          : require('./methods/checkTenantAccessPermission')
};

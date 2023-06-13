'use strict';

module.exports = {
  createTenantAccessRole                       : require('./methods/createTenantAccessRole'),
  deleteTenantAccessRole                       : require('./methods/deleteTenantAccessRole'),
  getTenantAccessRoleById                      : require('./methods/getTenantAccessRoleById'),
  getTenantAccessRoleByUuid                    : require('./methods/getTenantAccessRoleByUuid'),
  getTenantAccessRoleByTitle                   : require('./methods/getTenantAccessRoleByTitle'),
  getTenantAccessRolesByTenantUuid             : require('./methods/getTenantAccessRolesByTenantUuid'),
  getTenantAccessRolesByTenantOrganizationUuid : require('./methods/getTenantAccessRolesByTenantOrganizationUuid'),
  updateTenantAccessRole                       : require('./methods/updateTenantAccessRole')
};

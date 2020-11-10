'use strict';

module.exports = {
  createTenantAccessRole                     : require('./methods/createTenantAccessRole'),
  deleteTenantAccessRole                     : require('./methods/deleteTenantAccessRole'),
  getTenantAccessRoleById                    : require('./methods/getTenantAccessRoleById'),
  getTenantAccessRoleByTitle                 : require('./methods/getTenantAccessRoleByTitle'),
  getTenantAccessRolesByTenantId             : require('./methods/getTenantAccessRolesByTenantId'),
  getTenantAccessRolesByTenantOrganizationId : require('./methods/getTenantAccessRolesByTenantOrganizationId'),
  updateTenantAccessRole                     : require('./methods/updateTenantAccessRole')
};

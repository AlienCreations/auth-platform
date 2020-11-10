'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByTenantAccessRoleId;

const createAndExecuteQuery = tenantAccessRoleId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_permissions ' +
                         'WHERE tenant_access_role_id = ? ',
        queryStatement = [query, [tenantAccessRoleId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all tenantAccessPermissions by role id
 * @param {Number} tenantAccessRoleId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessPermissionsByTenantAccessRoleId = tenantAccessRoleId => {
  validateTenantAccessPermissionData({ tenantAccessRoleId });
  return createAndExecuteQuery(tenantAccessRoleId);
};

module.exports = getTenantAccessPermissionsByTenantAccessRoleId;

// TODO - refactor the resource and permission models to accept tenant id and tenant organization id
// TODO - refactor the check permissions query to also join against the role to ensure it matches the tenant organization role.
// TODO - include the tenant and organization ids in the JWT

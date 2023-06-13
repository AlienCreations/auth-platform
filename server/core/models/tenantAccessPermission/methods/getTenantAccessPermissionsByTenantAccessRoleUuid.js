'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByTenantAccessRoleUuid;

const createAndExecuteQuery = tenantAccessRoleUuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_permissions
                          WHERE tenant_access_role_uuid = ?
                            AND status > 0`,
        queryStatement = [query, [tenantAccessRoleUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessPermissionsByTenantAccessRoleUuid = tenantAccessRoleUuid => {
  validateTenantAccessPermissionData({ tenantAccessRoleUuid });
  return createAndExecuteQuery(tenantAccessRoleUuid);
};

module.exports = getTenantAccessPermissionsByTenantAccessRoleUuid;

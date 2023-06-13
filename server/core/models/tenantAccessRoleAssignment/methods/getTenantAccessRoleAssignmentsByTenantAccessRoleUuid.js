'use strict';

const DB                                       = require('../../../utils/db'),
      { validateForGetByTenantAccessRoleUuid } = require('../helpers/validateTenantAccessRoleAssignmentData');

const createAndExecuteQuery = tenantAccessRoleUuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_role_assignments
                          WHERE tenant_access_role_uuid = ?
                            AND status > 0`,
        queryStatement = [query, [tenantAccessRoleUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessRoleAssignmentsByTenantAccessRoleUuid = tenantAccessRoleUuid => {
  validateForGetByTenantAccessRoleUuid({ tenantAccessRoleUuid });
  return createAndExecuteQuery(tenantAccessRoleUuid);
};

module.exports = getTenantAccessRoleAssignmentsByTenantAccessRoleUuid;

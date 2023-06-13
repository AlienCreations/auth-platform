'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTenantUuid;

const createAndExecuteQuery = tenantUuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles
                          WHERE tenant_uuid = ?
                            AND status > 0
                          ORDER BY title ASC`,
        queryStatement = [query, [tenantUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessRolesByTenantUuid = tenantUuid => {
  validateTenantAccessRoleData({ tenantUuid });
  return createAndExecuteQuery(tenantUuid);
};

module.exports = getTenantAccessRolesByTenantUuid;

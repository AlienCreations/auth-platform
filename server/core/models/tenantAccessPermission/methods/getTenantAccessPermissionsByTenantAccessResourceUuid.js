'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByTenantAccessResourceUuid;

const createAndExecuteQuery = tenantAccessResourceUuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_permissions
                          WHERE tenant_access_resource_uuid = ?
                            AND status > 0`,
        queryStatement = [query, [tenantAccessResourceUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessPermissionsByTenantAccessResourceUuid = tenantAccessResourceUuid => {
  validateTenantAccessPermissionData({ tenantAccessResourceUuid });
  return createAndExecuteQuery(tenantAccessResourceUuid);
};

module.exports = getTenantAccessPermissionsByTenantAccessResourceUuid;

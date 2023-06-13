'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTenantOrganizationUuid;

const createAndExecuteQuery = tenantOrganizationUuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE tenant_organization_uuid = ? 
                            AND status > 0
                          ORDER BY title ASC`,
        queryStatement = [query, [tenantOrganizationUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessRolesByTenantUuid = tenantOrganizationUuid => {
  validateTenantAccessRoleData({ tenantOrganizationUuid });
  return createAndExecuteQuery(tenantOrganizationUuid);
};

module.exports = getTenantAccessRolesByTenantUuid;

'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByTenantOrganizationId;

const createAndExecuteQuery = tenantOrganizationId => {
  const query = `SELECT tap.* 
                    FROM ${DB.coreDbName}.tenant_access_permissions tap 
                    LEFT JOIN ${DB.coreDbName}.tenant_access_roles tar ON tap.tenant_access_role_id = tar.id 
                    WHERE tar.tenant_organization_id = ?`;

  const queryStatement = [query, [tenantOrganizationId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all tenantAccessPermissions by tenantOrganizationId
 * @param {Number} tenantOrganizationId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessPermissionsByTenantOrganizationId = tenantOrganizationId => {
  validateTenantAccessPermissionData({ tenantOrganizationId });
  return createAndExecuteQuery(tenantOrganizationId);
};

module.exports = getTenantAccessPermissionsByTenantOrganizationId;

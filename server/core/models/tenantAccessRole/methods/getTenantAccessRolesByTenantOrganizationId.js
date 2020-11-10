'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTenantOrganizationId;

const createAndExecuteQuery = tenantOrganizationId => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE tenant_organization_id = ? 
                          ORDER BY title ASC`,
        queryStatement = [query, [tenantOrganizationId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all access roles under a tenant
 * @param {Number} tenantOrganizationId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRolesByTenantId = tenantOrganizationId => {
  validateTenantAccessRoleData({ tenantOrganizationId });
  return createAndExecuteQuery(tenantOrganizationId);
};

module.exports = getTenantAccessRolesByTenantId;

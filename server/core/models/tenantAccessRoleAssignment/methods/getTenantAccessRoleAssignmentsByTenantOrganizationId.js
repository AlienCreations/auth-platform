'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetByTenantOrganizationId;

const createAndExecuteQuery = tenantOrganizationId => {
  const query = `SELECT tara.* 
                 FROM ${DB.coreDbName}.tenant_access_role_assignments tara 
                 LEFT JOIN ${DB.coreDbName}.tenant_access_roles tar ON tara.tenant_access_role_id = tar.id 
                 WHERE tar.tenant_organization_id = ?`;

  const queryStatement = [query, [tenantOrganizationId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all tenantAccessRoleAssignments by tenantOrganizationId
 * @param {Number} tenantOrganizationId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleAssignmentsByTenantOrganizationId = tenantOrganizationId => {
  validateTenantAccessRoleAssignmentData({ tenantOrganizationId });
  return createAndExecuteQuery(tenantOrganizationId);
};

module.exports = getTenantAccessRoleAssignmentsByTenantOrganizationId;

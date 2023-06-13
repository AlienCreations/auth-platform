'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetByTenantOrganizationUuid;

const createAndExecuteQuery = tenantOrganizationUuid => {
  const query = `SELECT tara.* 
                 FROM ${DB.coreDbName}.tenant_access_role_assignments tara 
                 LEFT JOIN ${DB.coreDbName}.tenant_access_roles tar ON tara.tenant_access_role_uuid = tar.uuid 
                 WHERE tar.tenant_organization_uuid = ?
                   AND tar.status > 0
                   AND tara.status > 0`;

  const queryStatement = [query, [tenantOrganizationUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessRoleAssignmentsByTenantOrganizationUuid = tenantOrganizationUuid => {
  validateTenantAccessRoleAssignmentData({ tenantOrganizationUuid });
  return createAndExecuteQuery(tenantOrganizationUuid);
};

module.exports = getTenantAccessRoleAssignmentsByTenantOrganizationUuid;

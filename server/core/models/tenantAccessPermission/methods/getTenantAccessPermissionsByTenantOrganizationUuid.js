'use strict';

const DB                                         = require('../../../utils/db'),
      { validateForGetByTenantOrganizationUuid } = require('../helpers/validateTenantAccessPermissionData');

const createAndExecuteQuery = tenantOrganizationUuid => {
  const query = `SELECT tap.* 
                 FROM ${DB.coreDbName}.tenant_access_permissions tap 
                 LEFT JOIN ${DB.coreDbName}.tenant_access_roles tar
                   ON tap.tenant_access_role_uuid = tar.uuid 
                 WHERE tar.tenant_organization_uuid = ?
                   AND tap.status > 0
                   AND tar.status > 0`;

  const queryStatement = [query, [tenantOrganizationUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessPermissionsByTenantOrganizationUuid = tenantOrganizationUuid => {
  validateForGetByTenantOrganizationUuid({ tenantOrganizationUuid });
  return createAndExecuteQuery(tenantOrganizationUuid);
};

module.exports = getTenantAccessPermissionsByTenantOrganizationUuid;

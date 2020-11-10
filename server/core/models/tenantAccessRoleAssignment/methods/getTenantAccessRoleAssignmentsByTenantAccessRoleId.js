'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetByTenantAccessRoleId;

const createAndExecuteQuery = tenantAccessRoleId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_role_assignments ' +
                         'WHERE tenant_access_role_id = ? ',
        queryStatement = [query, [tenantAccessRoleId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all tenantAccessRoleAssignments under a tenant
 * @param {Number} tenantAccessRoleId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleAssignmentsByTenantAccessRoleId = tenantAccessRoleId => {
  validateTenantAccessRoleAssignmentData({ tenantAccessRoleId });
  return createAndExecuteQuery(tenantAccessRoleId);
};

module.exports = getTenantAccessRoleAssignmentsByTenantAccessRoleId;

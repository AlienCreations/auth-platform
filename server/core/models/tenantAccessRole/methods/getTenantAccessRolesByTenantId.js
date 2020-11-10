'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTenantId;

const createAndExecuteQuery = tenantId => {
  const query          = 'SELECT  * FROM ' + DB.coreDbName + '.tenant_access_roles WHERE tenant_id = ? ORDER BY title ASC',
        queryStatement = [query, [tenantId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all access roles under a tenant
 * @param {Number} tenantId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRolesByTenantId = tenantId => {
  validateTenantAccessRoleData({ tenantId });
  return createAndExecuteQuery(tenantId);
};

module.exports = getTenantAccessRolesByTenantId;

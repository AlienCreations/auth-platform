'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByTenantAccessResourceId;

const createAndExecuteQuery = tenantAccessResourceId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_permissions ' +
                         'WHERE tenant_access_resource_id = ? ',
        queryStatement = [query, [tenantAccessResourceId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all tenantAccessPermissions by resource id
 * @param {Number} tenantAccessResourceId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessPermissionsByTenantAccessResourceId = tenantAccessResourceId => {
  validateTenantAccessPermissionData({ tenantAccessResourceId });
  return createAndExecuteQuery(tenantAccessResourceId);
};

module.exports = getTenantAccessPermissionsByTenantAccessResourceId;

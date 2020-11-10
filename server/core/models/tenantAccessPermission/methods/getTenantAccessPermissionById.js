'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT  * FROM ' + DB.coreDbName + '.tenant_access_permissions ' +
                         'WHERE id = ? ',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantAccessPermission by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessPermissionById = id => {
  validateTenantAccessPermissionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessPermissionById;

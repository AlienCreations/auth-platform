'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_access_permissions WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantAccessPermission record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantAccessPermission = id => {
  validateTenantAccessPermissionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantAccessPermission;

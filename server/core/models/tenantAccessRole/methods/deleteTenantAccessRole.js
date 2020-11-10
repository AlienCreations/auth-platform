'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_access_roles WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantAccessRole record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantAccessRole = id => {
  validateTenantAccessRoleData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantAccessRole;

'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_access_role_assignments WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantAccessRoleAssignment record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantAccessRoleAssignment = id => {
  validateTenantAccessRoleAssignmentData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantAccessRoleAssignment;

'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForDeleteByCloudUserId;

const createAndExecuteQuery = cloudUserId => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_access_role_assignments WHERE cloud_user_id = ?',
        queryStatement = [query, [cloudUserId]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantAccessRoleAssignment record
 * @param {Number} cloudUserId
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantAccessRoleAssignmentsByCloudUserId = cloudUserId => {
  validateTenantAccessRoleAssignmentData({ cloudUserId });
  return createAndExecuteQuery(cloudUserId);
};

module.exports = deleteTenantAccessRoleAssignmentsByCloudUserId;

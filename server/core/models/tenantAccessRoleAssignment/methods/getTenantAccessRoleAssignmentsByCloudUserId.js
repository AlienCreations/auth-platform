'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetByCloudUserId;

const createAndExecuteQuery = cloudUserId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_role_assignments ' +
                         'WHERE cloud_user_id = ? ',
        queryStatement = [query, [cloudUserId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up an tenantAccessRoleAssignment by cloudUserId
 * @param {Number} cloudUserId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleAssignmentsByCloudUserId = cloudUserId => {
  validateTenantAccessRoleAssignmentData({ cloudUserId });
  return createAndExecuteQuery(cloudUserId);
};

module.exports = getTenantAccessRoleAssignmentsByCloudUserId;

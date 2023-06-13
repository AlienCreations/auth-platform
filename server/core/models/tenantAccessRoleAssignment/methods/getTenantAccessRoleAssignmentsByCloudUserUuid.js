'use strict';

const DB                                = require('../../../utils/db'),
      { validateForGetByCloudUserUuid } = require('../helpers/validateTenantAccessRoleAssignmentData');

const createAndExecuteQuery = cloudUserUuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_role_assignments
                          WHERE cloud_user_uuid = ?
                            AND status > 0`,
        queryStatement = [query, [cloudUserUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessRoleAssignmentsByCloudUserUuid = cloudUserUuid => {
  validateForGetByCloudUserUuid({ cloudUserUuid });
  return createAndExecuteQuery(cloudUserUuid);
};

module.exports = getTenantAccessRoleAssignmentsByCloudUserUuid;

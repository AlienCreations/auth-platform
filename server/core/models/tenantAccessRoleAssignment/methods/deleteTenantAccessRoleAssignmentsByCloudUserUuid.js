'use strict';

const DB                                   = require('../../../utils/db'),
      { validateForDeleteByCloudUserUuid } = require('../helpers/validateTenantAccessRoleAssignmentData');

const createAndExecuteQuery = cloudUserUuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_access_role_assignments 
                          WHERE cloud_user_uuid = ?`,
        queryStatement = [query, [cloudUserUuid]];

  return DB.query(queryStatement);
};

const deleteTenantAccessRoleAssignmentsByCloudUserUuid = cloudUserUuid => {
  validateForDeleteByCloudUserUuid({ cloudUserUuid });
  return createAndExecuteQuery(cloudUserUuid);
};

module.exports = deleteTenantAccessRoleAssignmentsByCloudUserUuid;

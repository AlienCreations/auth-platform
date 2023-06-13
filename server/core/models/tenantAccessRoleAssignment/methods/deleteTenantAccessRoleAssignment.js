'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_access_role_assignments 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantAccessRoleAssignment = uuid => {
  validateTenantAccessRoleAssignmentData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantAccessRoleAssignment;

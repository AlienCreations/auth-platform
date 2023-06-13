'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT  * FROM ${DB.coreDbName}.tenant_access_role_assignments
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantAccessRoleAssignmentByUuid = uuid => {
  validateTenantAccessRoleAssignmentData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantAccessRoleAssignmentByUuid;

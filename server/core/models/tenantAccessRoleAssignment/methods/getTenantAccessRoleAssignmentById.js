'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT  * FROM ${DB.coreDbName}.tenant_access_role_assignments
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantAccessRoleAssignmentById = id => {
  validateTenantAccessRoleAssignmentData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessRoleAssignmentById;

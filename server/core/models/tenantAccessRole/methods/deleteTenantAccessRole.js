'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantAccessRole = uuid => {
  validateTenantAccessRoleData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantAccessRole;

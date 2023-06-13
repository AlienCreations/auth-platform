'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_access_permissions 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantAccessPermission = uuid => {
  validateTenantAccessPermissionData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantAccessPermission;

'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_permissions
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantAccessPermissionByUuid = uuid => {
  validateTenantAccessPermissionData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantAccessPermissionByUuid;

'use strict';

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_permissions
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantAccessPermissionById = id => {
  validateTenantAccessPermissionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessPermissionById;

'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantAccessRoleByUuid = uuid => {
  validateTenantAccessRoleData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantAccessRoleByUuid;

'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTitle;

const createAndExecuteQuery = title => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE title = ?
                            AND status > 0`,
        queryStatement = [query, [title]];

  return DB.lookupSafe(queryStatement);
};

const getTenantAccessRoleByTitle = title => {
  validateTenantAccessRoleData({ title });
  return createAndExecuteQuery(title);
};

module.exports = getTenantAccessRoleByTitle;

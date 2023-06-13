'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_roles 
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantAccessRoleById = id => {
  validateTenantAccessRoleData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessRoleById;

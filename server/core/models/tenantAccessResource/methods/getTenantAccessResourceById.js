'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantAccessResourceById = id => {
  validateTenantAccessResourceData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessResourceById;

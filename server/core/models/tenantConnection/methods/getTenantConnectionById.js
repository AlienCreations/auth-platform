'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_connections 
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantConnectionById = id => {
  validateTenantConnectionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantConnectionById;

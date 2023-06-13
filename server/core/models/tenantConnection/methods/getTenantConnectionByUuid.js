'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_connections 
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantConnectionByUuid = uuid => {
  validateTenantConnectionData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantConnectionByUuid;

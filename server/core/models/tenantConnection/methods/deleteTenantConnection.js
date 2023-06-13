'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_connections 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantConnection = uuid => {
  validateTenantConnectionData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantConnection;

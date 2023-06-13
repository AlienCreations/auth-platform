'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByUriAndMethod;

const createAndExecuteQuery = (uri, method) => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE (uri = ? AND method = ?) 
                          OR (uri = "*" AND method = "*")
                            AND status > 0`,
        queryStatement = [query, [uri,method]];

  return DB.querySafe(queryStatement);
};

const getTenantAccessResourcesByUriAndMethod = (uri, method) => {
  validateTenantAccessResourceData({ uri, method });
  return createAndExecuteQuery(uri, method);
};

module.exports = getTenantAccessResourcesByUriAndMethod;

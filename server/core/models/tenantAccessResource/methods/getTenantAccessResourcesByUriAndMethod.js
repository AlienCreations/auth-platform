'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByUriAndMethod;

const createAndExecuteQuery = (uri, method) => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE (uri = ? AND method = ?) 
                          OR (uri = "*" AND method = "*")`,
        queryStatement = [query, [uri,method]];

  return DB.querySafe(queryStatement);
};

/**
 * Find tenantAccessResource by uri,method plus wildcards for platform tenant/admin
 * @param {String} uri
 * @param {String} method
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessResourcesByUriAndMethod = (uri, method) => {
  validateTenantAccessResourceData({ uri, method });
  return createAndExecuteQuery(uri, method);
};

module.exports = getTenantAccessResourcesByUriAndMethod;

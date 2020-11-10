'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByKey;

const createAndExecuteQuery = key => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_resources WHERE `key` = ? ',
        queryStatement = [query, [key]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantAccessResource by key
 * @param {String} key
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessResourceByKey = key => {
  validateTenantAccessResourceData({ key });
  return createAndExecuteQuery(key);
};

module.exports = getTenantAccessResourceByKey;

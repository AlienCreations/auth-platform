'use strict';

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForGetByDomain;

const createAndExecuteQuery = domain => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenants WHERE domain = ?',
        queryStatement = [query, [domain]];

  return DB.lookup(queryStatement);
};

/**
 * Select a tenant from the provided domain.
 * @param {String} domain
 * @returns {Promise}
 */
const getTenantByDomain = domain => {
  validateTenantData({ domain });
  return createAndExecuteQuery(domain);
};

module.exports = getTenantByDomain;

'use strict';

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForGetByDomain;

const createAndExecuteQuery = domain => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenants 
                          WHERE domain = ?
                           AND status > 0`,
        queryStatement = [query, [domain]];

  return DB.lookup(queryStatement);
};

const getTenantByDomain = domain => {
  validateTenantData({ domain });
  return createAndExecuteQuery(domain);
};

module.exports = getTenantByDomain;

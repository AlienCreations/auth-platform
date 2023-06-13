'use strict';

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenants
                          WHERE id = ?
                           AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantById = id => {
  validateTenantData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantById;

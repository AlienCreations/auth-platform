'use strict';

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenants WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Select a tenant from the provided id.
 * @param {Number} id
 * @returns {Promise}
 */
const getTenantById = id => {
  validateTenantData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantById;

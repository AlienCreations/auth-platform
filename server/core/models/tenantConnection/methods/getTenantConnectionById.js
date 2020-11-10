'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_connections WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Select a tenant_connection from the provided id.
 * @param {Number} id
 * @returns {Promise}
 */
const getTenantConnectionById = id => {
  validateTenantConnectionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantConnectionById;

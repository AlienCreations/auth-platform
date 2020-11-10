'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetByTenantId;

const createAndExecuteQuery = tenantId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_connections WHERE tenant_id = ? ORDER BY id ASC',
        queryStatement = [query, [tenantId]];

  return DB.querySafe(queryStatement);
};

/**
 * Select connection data for a provided tenant.
 * @param {Number} tenantId
 * @returns {Promise}
 */
const getTenantConnectionsByTenantId = tenantId => {
  validateTenantConnectionData({ tenantId });
  return createAndExecuteQuery(tenantId);
};

module.exports = getTenantConnectionsByTenantId;

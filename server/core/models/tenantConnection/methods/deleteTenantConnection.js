'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_connections WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantConnection record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantConnection = id => {
  validateTenantConnectionData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantConnection;

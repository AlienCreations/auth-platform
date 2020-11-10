'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_access_resources WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantAccessResource record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantAccessResource = id => {
  validateTenantAccessResourceData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantAccessResource;

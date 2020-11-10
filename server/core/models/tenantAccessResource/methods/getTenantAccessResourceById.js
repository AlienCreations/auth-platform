'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_resources WHERE id = ? ',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantAccessResource by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessResourceById = id => {
  validateTenantAccessResourceData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessResourceById;

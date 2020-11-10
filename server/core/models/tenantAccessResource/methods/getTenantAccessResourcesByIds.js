'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByIds;

const createAndExecuteQuery = ids => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_resources WHERE id IN ? ',
        queryStatement = [query, [ids]];

  return DB.query(queryStatement);
};

/**
 * Get all tenantAccessResources by ids
 * @param {Array} ids
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessResourcesByIds = ids => {
  validateTenantAccessResourceData({ ids });
  return createAndExecuteQuery(ids);
};

module.exports = getTenantAccessResourcesByIds;

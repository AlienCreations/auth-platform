'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForGetByTenantId;

const createAndExecuteQuery = tenantId => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_organizations WHERE tenant_id = ? ORDER BY title ASC',
        queryStatement = [query, [tenantId]];

  return DB.querySafe(queryStatement);
};

/**
 * Select organizations data for a provided tenant.
 * @param {Number} tenantId
 * @returns {Promise}
 */
const getTenantOrganizationsByTenantId = tenantId => {
  validateTenantOrganizationData({ tenantId });
  return createAndExecuteQuery(tenantId);
};

module.exports = getTenantOrganizationsByTenantId;

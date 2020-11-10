'use strict';

const DB = require('../../../utils/db');

/**
 * Select tenantOrganization data.
 * @returns {Promise}
 */
const getAllTenantOrganizations = () => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_organizations ORDER BY tenant_id ASC, title ASC',
        queryStatement = [query, []];

  return DB.querySafe(queryStatement);
};

module.exports = getAllTenantOrganizations;

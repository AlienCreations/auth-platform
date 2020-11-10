'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_organizations WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Select a tenant_organization from the provided id.
 * @param {Number} id
 * @returns {Promise}
 */
const getTenantOrganizationById = id => {
  validateTenantOrganizationData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantOrganizationById;

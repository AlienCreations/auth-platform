'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_organizations WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantOrganization record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantOrganization = id => {
  validateTenantOrganizationData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantOrganization;

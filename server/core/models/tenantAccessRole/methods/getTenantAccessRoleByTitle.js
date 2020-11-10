'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetByTitle;

const createAndExecuteQuery = title => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_roles WHERE title = ? ',
        queryStatement = [query, [title]];

  return DB.lookupSafe(queryStatement);
};

/**
 * Look up an tenantAccessRole by title
 * @param {String} title
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleByTitle = title => {
  validateTenantAccessRoleData({ title });
  return createAndExecuteQuery(title);
};

module.exports = getTenantAccessRoleByTitle;

'use strict';

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_roles WHERE id = ? ',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantAccessRole by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleById = id => {
  validateTenantAccessRoleData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessRoleById;

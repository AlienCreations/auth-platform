'use strict';

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT  * FROM ' + DB.coreDbName + '.tenant_access_role_assignments ' +
                         'WHERE id = ? ',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantAccessRoleAssignment by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantAccessRoleAssignmentById = id => {
  validateTenantAccessRoleAssignmentData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantAccessRoleAssignmentById;

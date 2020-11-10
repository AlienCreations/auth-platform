'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForDelete;

const createAndExecuteQuery = id => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.tenant_members WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Delete a tenantMember record
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const deleteTenantMember = id => {
  validateTenantMemberData({ id });
  return createAndExecuteQuery(id);
};

module.exports = deleteTenantMember;

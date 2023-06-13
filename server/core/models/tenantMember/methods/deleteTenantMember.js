'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_members 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantMember = uuid => {
  validateTenantMemberData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantMember;

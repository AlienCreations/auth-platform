'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_access_resources WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantAccessResource = uuid => {
  validateTenantAccessResourceData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantAccessResource;

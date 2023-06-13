'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantAccessResourceByUuid = uuid => {
  validateTenantAccessResourceData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantAccessResourceByUuid;

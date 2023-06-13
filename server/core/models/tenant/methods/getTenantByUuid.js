'use strict';

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenants
                          WHERE uuid = ?
                           AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantByUuid = uuid => {
  validateTenantData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantByUuid;

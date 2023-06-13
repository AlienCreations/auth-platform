'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE uuid = ?
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getTenantOrganizationByUuid = uuid => {
  validateTenantOrganizationData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getTenantOrganizationByUuid;

'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_tenants 
                          WHERE uuid = ?
                           AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getProspectTenantByUuid = uuid => {
  validateProspectTenantData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getProspectTenantByUuid;

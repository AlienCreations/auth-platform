'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_tenants 
                          WHERE id = ?
                           AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getProspectTenantById = id => {
  validateProspectTenantData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getProspectTenantById;

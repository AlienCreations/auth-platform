'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetByEmail;

const createAndExecuteQuery = email => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_tenants 
                          WHERE email = ?
                           AND status > 0`,
        queryStatement = [query, [email]];

  return DB.lookup(queryStatement);
};

const getProspectTenantByEmail = email => {
  validateProspectTenantData({ email });
  return createAndExecuteQuery(email);
};

module.exports = getProspectTenantByEmail;

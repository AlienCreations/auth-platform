'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetByEmailAndToken;

const createAndExecuteQuery = (email, token) => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_tenants 
                          WHERE email = ? 
                           AND token = ?
                           AND status > 0`,
        queryStatement = [query, [email, token]];

  return DB.lookup(queryStatement);
};

const getProspectTenantByEmailAndToken = (email, token) => {
  validateProspectTenantData({ email, token });
  return createAndExecuteQuery(email, token);
};

module.exports = getProspectTenantByEmailAndToken;

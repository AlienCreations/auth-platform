'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetByEmailAndToken;

const createAndExecuteQuery = (email, token) => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_tenants WHERE email = ? AND token = ?',
        queryStatement = [query, [email, token]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect tenant by email and token
 * @param {String} email
 * @param {String} token
 * @returns {Promise}
 */
const getProspectTenantByEmailAndToken = (email, token) => {
  validateProspectTenantData({ email, token });
  return createAndExecuteQuery(email, token);
};

module.exports = getProspectTenantByEmailAndToken;

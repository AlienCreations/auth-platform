'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetByEmail;

const createAndExecuteQuery = email => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_tenants WHERE email = ?',
        queryStatement = [query, [email]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect tenant by email
 * @param {String} email
 * @returns {Promise}
 */
const getProspectTenantByEmail = email => {
  validateProspectTenantData({ email });
  return createAndExecuteQuery(email);
};

module.exports = getProspectTenantByEmail;

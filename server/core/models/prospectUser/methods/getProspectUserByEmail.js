'use strict';

const DB                       = require('../../../utils/db'),
      validateProspectUserData = require('../helpers/validateProspectUserData').validateForGetByEmail;

const createAndExecuteQuery = email => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_users WHERE email = ?',
        queryStatement = [query, [email]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect user by email
 * @param {String} email
 * @returns {Promise}
 */
const getProspectUserByEmail = email => {
  validateProspectUserData({ email });
  return createAndExecuteQuery(email);
};

module.exports = getProspectUserByEmail;

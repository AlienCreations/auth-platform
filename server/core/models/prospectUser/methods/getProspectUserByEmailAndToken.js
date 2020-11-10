'use strict';

const DB                       = require('../../../utils/db'),
      validateProspectUserData = require('../helpers/validateProspectUserData').validateForGetByEmailAndToken;

const createAndExecuteQuery = (email, token) => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_users WHERE email = ? AND token = ?',
        queryStatement = [query, [email, token]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect user by email and token
 * @param {String} email
 * @param {String} token
 * @returns {Promise}
 */
const getProspectUserByEmailAndToken = (email, token) => {
  validateProspectUserData({ email, token });
  return createAndExecuteQuery(email, token);
};

module.exports = getProspectUserByEmailAndToken;

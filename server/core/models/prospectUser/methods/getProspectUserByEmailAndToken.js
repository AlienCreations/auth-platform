'use strict';

const DB                                = require('../../../utils/db'),
      { validateForGetByEmailAndToken } = require('../helpers/validateProspectUserData');

const createAndExecuteQuery = (email, token) => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_users 
                          WHERE email = ?
                           AND token = ?
                           AND status > 0`,
        queryStatement = [query, [email, token]];

  return DB.lookup(queryStatement);
};

const getProspectUserByEmailAndToken = (email, token) => {
  validateForGetByEmailAndToken({ email, token });
  return createAndExecuteQuery(email, token);
};

module.exports = getProspectUserByEmailAndToken;

'use strict';

const DB                        = require('../../../utils/db'),
      { validateForGetByEmail } = require('../helpers/validateProspectUserData');

const createAndExecuteQuery = email => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_users 
                          WHERE email = ?
                           AND status > 0`,
        queryStatement = [query, [email]];

  return DB.lookup(queryStatement);
};

const getProspectUserByEmail = email => {
  validateForGetByEmail({ email });
  return createAndExecuteQuery(email);
};

module.exports = getProspectUserByEmail;

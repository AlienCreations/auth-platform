'use strict';

const R = require('ramda');

const DB                        = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForGetByToken;

const createAndExecuteQuery = token => {
  const query          = `SELECT * FROM ${DB.coreDbName}.password_resets 
                          WHERE token = ?
                           AND status > 0`;
  const queryStatement = [query, [token]];

  return DB.lookup(queryStatement);
};

const decorateResponseData = R.identity;

const getPasswordResetByToken = token => {
  validatePasswordResetData({ token });
  return createAndExecuteQuery(token)
    .then(decorateResponseData);
};

module.exports = getPasswordResetByToken;

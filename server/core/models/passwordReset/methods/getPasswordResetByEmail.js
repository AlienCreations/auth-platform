'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForGetByEmail;

const createAndExecuteQuery = cloudUserEmail => {
  const query          = `SELECT * FROM ${DB.coreDbName}.password_resets 
                          WHERE cloud_user_email = ?
                           AND status > 0`;
  const queryStatement = [query, [cloudUserEmail]];

  return DB.lookup(queryStatement);
};

const decorateResponseData = R.identity;

const getPasswordResetByEmail = cloudUserEmail => {
  validatePasswordResetData({ cloudUserEmail });
  return createAndExecuteQuery(cloudUserEmail)
    .then(decorateResponseData);
};

module.exports = getPasswordResetByEmail;

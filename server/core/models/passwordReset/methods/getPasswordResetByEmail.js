'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForGetByEmail;

const createAndExecuteQuery = cloudUserEmail => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.password_resets WHERE cloud_user_email = ?';
  const queryStatement = [query, [cloudUserEmail]];

  return DB.lookup(queryStatement);
};

const decorateResponseData = data => {
  const dataCopy = R.clone(data);
  return dataCopy;
};

/**
 * Fetch password reset by email
 * @param {String} cloudUserEmail
 * @throws {Error}
 * @returns {Promise}
 */
const getPasswordResetByEmail = cloudUserEmail => {
  validatePasswordResetData({ cloudUserEmail });
  return createAndExecuteQuery(cloudUserEmail)
    .then(decorateResponseData);
};

module.exports = getPasswordResetByEmail;

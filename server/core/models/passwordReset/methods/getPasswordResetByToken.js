'use strict';

const R = require('ramda');

const DB                        = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForGetByToken;

const createAndExecuteQuery = token => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.password_resets WHERE token = ?';
  const queryStatement = [query, [token]];

  return DB.lookup(queryStatement);
};

const decorateResponseData = data => {
  const dataCopy = R.clone(data);
  return dataCopy;
};

/**
 * Fetch password reset by token
 * @param {String} token
 * @throws {Error}
 * @returns {Promise}
 */
const getPasswordResetByToken = token => {
  validatePasswordResetData({ token });
  return createAndExecuteQuery(token)
    .then(decorateResponseData);
};

module.exports = getPasswordResetByToken;

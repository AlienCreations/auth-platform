'use strict';

const R             = require('ramda'),
      uuid          = require('uuid/v4'),
      passwordUtils = require('../../../utils/password');

const DB                        = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForReplace;

const decorateDataForDbInsertion = passwordResetData => {
  let dataCopy = R.clone(passwordResetData);
  dataCopy.token = passwordUtils.makePasswordHash(uuid(), 10);
  return dataCopy;
};

const createAndExecuteQuery = passwordResetData => {
  passwordResetData = decorateDataForDbInsertion(passwordResetData);

  const fields = R.keys(passwordResetData);
  const query  = 'REPLACE INTO ' + DB.coreDbName + '.password_resets SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(passwordResetData)];

  return DB.query(queryStatement);
};

/**
 * Insert a password reset record.
 * @param {Object} passwordResetData
 * @throws {Error}
 * @returns {Promise}
 */
const createPasswordResetToken = passwordResetData => {
  validatePasswordResetData(R.defaultTo({}, passwordResetData));
  return createAndExecuteQuery(passwordResetData);
};

module.exports = createPasswordResetToken;

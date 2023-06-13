'use strict';

const DB                        = require('../../../utils/db'),
      validatePasswordResetData = require('../helpers/validatePasswordResetData').validateForDelete;

const createAndExecuteQuery = token => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.password_resets WHERE token = ?';
  const queryStatement = [query, [token]];
  return DB.query(queryStatement);
};

const deletePasswordResetToken = token => {
  validatePasswordResetData({ token });
  return createAndExecuteQuery(token);
};

module.exports = deletePasswordResetToken;

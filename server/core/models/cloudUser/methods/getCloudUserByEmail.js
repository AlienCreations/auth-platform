'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByEmail;

const createAndExecuteQuery = email => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.cloud_users WHERE email = ?',
        queryStatement = [query, [email]];

  return DB.lookupSafe(queryStatement);
};

/**
 * Lookup a cloud user by email
 * @param {String} email
 * @returns {Promise}
 */
const getCloudUserByEmail = email => {
  validateCloudUserData({ email });
  return createAndExecuteQuery(email);
};

module.exports = getCloudUserByEmail;

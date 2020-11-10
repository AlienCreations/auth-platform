'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.cloud_users WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a cloud user by id
 * @param {Number} id
 * @returns {Promise}
 */
const getCloudUserById = id => {
  validateCloudUserData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getCloudUserById;

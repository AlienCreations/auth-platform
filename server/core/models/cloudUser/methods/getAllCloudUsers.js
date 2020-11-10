'use strict';

const DB = require('../../../utils/db');

/**
 * Select all the cloudUsers in the system.
 * @returns {Promise}
 */
const getAllCloudUsers = () => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.cloud_users ORDER BY last_name ASC, first_name ASC',
        queryStatement = [query, []];

  return DB.querySafe(queryStatement);
};

module.exports = getAllCloudUsers;

'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForSearch;

const createAndExecuteQuery = (field, searchTerm) => {
  const query = `SELECT id, first_name, last_name, middle_initial
                 FROM  ${DB.coreDbName}.cloud_users 
                 WHERE ${field} LIKE ? 
                   AND status > 0
                 ORDER BY last_name ASC`;

  const fuzzySearch    = DB.fuzzify(searchTerm);
  const queryStatement = [query, [fuzzySearch]];

  return DB.querySafe(queryStatement);
};

const searchCloudUsers = (field, searchTerm) => {
  validateCloudUserData({ field, searchTerm });
  return createAndExecuteQuery(field, searchTerm);
};

module.exports = searchCloudUsers;

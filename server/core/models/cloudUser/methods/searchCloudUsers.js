'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForSearch;

const createAndExecuteQuery = (field, searchTerm) => {
  const query = 'SELECT id, first_name, last_name, middle_initial ' +
                'FROM  ' + DB.coreDbName + '.cloud_users ' +
                'WHERE ' + field + ' LIKE ? ' +
                'ORDER BY last_name ASC';

  const fuzzySearch    = DB.fuzzify(searchTerm);
  const queryStatement = [query, [fuzzySearch]];

  return DB.querySafe(queryStatement);
};

/**
 * Search cloudUser by provided field and search term
 * @param {String} field
 * @param {String} searchTerm
 * @returns {Promise}
 */
const searchCloudUsers = (field, searchTerm) => {
  validateCloudUserData({ field, searchTerm });
  return createAndExecuteQuery(field, searchTerm);
};

module.exports = searchCloudUsers;

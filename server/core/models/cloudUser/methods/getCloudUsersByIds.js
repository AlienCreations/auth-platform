'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByIds;

const createAndExecuteQuery = ids => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.cloud_users WHERE id IN (?)',
        queryStatement = [query, [ids]];

  return DB.querySafe(queryStatement);
};

/**
 * Lookup a cloud user by ids
 * @param {Array} ids
 * @returns {Promise}
 */
const getCloudUsersByIds = ids => {
  validateCloudUserData({ ids });
  return createAndExecuteQuery(ids);
};

module.exports = getCloudUsersByIds;

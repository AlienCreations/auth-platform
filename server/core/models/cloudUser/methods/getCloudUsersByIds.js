'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByIds;

const createAndExecuteQuery = ids => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.cloud_users 
                          WHERE id IN (?)
                           AND status > 0`,
        queryStatement = [query, [ids]];

  return DB.querySafe(queryStatement);
};

const getCloudUsersByIds = ids => {
  validateCloudUserData({ ids });
  return createAndExecuteQuery(ids);
};

module.exports = getCloudUsersByIds;

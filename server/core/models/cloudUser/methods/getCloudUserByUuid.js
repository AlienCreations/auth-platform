'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.cloud_users 
                          WHERE uuid = ?
                           AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookupSafe(queryStatement);
};

const getCloudUserByUuid = uuid => {
  validateCloudUserData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getCloudUserByUuid;

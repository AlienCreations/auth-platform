'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByUuids;

const createAndExecuteQuery = uuids => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.cloud_users 
                          WHERE uuid IN (?)
                           AND status > 0`,
        queryStatement = [query, [uuids]];

  return DB.querySafe(queryStatement);
};

const getCloudUsersByUuids = uuids => {
  validateCloudUserData({ uuids });
  return createAndExecuteQuery(uuids);
};

module.exports = getCloudUsersByUuids;

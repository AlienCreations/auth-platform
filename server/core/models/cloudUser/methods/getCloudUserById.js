'use strict';

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.cloud_users 
                          WHERE id = ?
                           AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getCloudUserById = id => {
  validateCloudUserData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getCloudUserById;

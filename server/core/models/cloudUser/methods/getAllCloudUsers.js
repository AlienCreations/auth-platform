'use strict';

const DB = require('../../../utils/db');

const getAllCloudUsers = () => {
  const query          = `SELECT * FROM ${DB.coreDbName}.cloud_users 
                          WHERE status > 0
                          ORDER BY last_name ASC, first_name ASC`,
        queryStatement = [query, []];

  return DB.querySafe(queryStatement);
};

module.exports = getAllCloudUsers;

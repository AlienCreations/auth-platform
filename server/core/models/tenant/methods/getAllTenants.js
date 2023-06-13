'use strict';

const DB = require('../../../utils/db');

const getAllTenants = () => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenants 
                          ORDER BY domain ASC`,
        queryStatement = [query, []];

  return DB.querySafe(queryStatement);
};

module.exports = getAllTenants;

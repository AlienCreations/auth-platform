'use strict';

const config = require('config'),
      R      = require('ramda');

const DB                    = require('../../../utils/db'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForGetByStrategyRef;

const createAndExecuteQuery = (strategy, id) => {
  if (!R.includes(strategy, config.auth.userStrategies)) {
    throw new Error(`User strategy ${JSON.stringify(strategy)} is not supported.`);
  } else {
    const query          = `SELECT * FROM ${DB.coreDbName}.cloud_users WHERE strategy_refs->>'$.${strategy}' = ?`,
          queryStatement = [query, [id]];

    return DB.lookup(queryStatement);
  }
};

const getCloudUserByStrategyRef = strategy => id => {
  validateCloudUserData({ strategy, id });
  return createAndExecuteQuery(strategy, id);
};

module.exports = getCloudUserByStrategyRef;

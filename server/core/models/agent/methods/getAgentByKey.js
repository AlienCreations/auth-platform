'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForGetByKey;

const createAndExecuteQuery = key => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.agents 
                          WHERE \`key\` = ? 
                            AND status > 0`,
        queryStatement = [query, [key]];

  return DB.lookup(queryStatement);
};

const getAgentByKey = key => {
  validateAgentData({ key });
  return createAndExecuteQuery(key);
};

module.exports = getAgentByKey;

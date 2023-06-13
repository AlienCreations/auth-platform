'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForGetByUuid;

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.agents 
                          WHERE uuid = ? 
                            AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getAgentByUuid = uuid => {
  validateAgentData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getAgentByUuid;

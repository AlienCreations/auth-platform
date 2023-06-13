'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.agents 
                          WHERE id = ? 
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getAgentById = id => {
  validateAgentData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getAgentById;

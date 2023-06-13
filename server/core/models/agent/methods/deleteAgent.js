'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.agents WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteAgent = uuid => {
  validateAgentData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteAgent;

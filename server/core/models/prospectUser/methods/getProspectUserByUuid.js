'use strict';

const DB                       = require('../../../utils/db'),
      { validateForGetByUuid } = require('../helpers/validateProspectUserData');

const createAndExecuteQuery = uuid => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_users 
                          WHERE uuid = ?
                           AND status > 0`,
        queryStatement = [query, [uuid]];

  return DB.lookup(queryStatement);
};

const getProspectUserByUuid = uuid => {
  validateForGetByUuid({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = getProspectUserByUuid;

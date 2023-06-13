'use strict';

const DB                     = require('../../../utils/db'),
      { validateForGetById } = require('../helpers/validateProspectUserData');

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.prospect_users 
                          WHERE id = ?
                           AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getProspectUserById = id => {
  validateForGetById({ id });
  return createAndExecuteQuery(id);
};

module.exports = getProspectUserById;

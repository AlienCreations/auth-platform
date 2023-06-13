'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateProspectUserData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = R.curry((uuid, _prospectUserData) => {
  const prospectUserData = decorateDataForDbInsertion(_prospectUserData);

  const query = `UPDATE ${DB.coreDbName}.prospect_users
                 SET ${DB.prepareProvidedFieldsForSet(prospectUserData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(prospectUserData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

const updateProspectUser = R.curry((uuid, prospectUserData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(prospectUserData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(prospectUserData);

  return Promise.resolve(prospectUserData)
    .then(createAndExecuteQuery(uuid));
});

module.exports = updateProspectUser;

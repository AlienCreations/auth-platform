'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                    = require('../../../utils/db'),
      { validateForInsert } = require('../helpers/validateProspectUserData');

const decorateDataForDbInsertion = prospectUserData => {
  return R.compose(
    R.assoc('uuid', uuid()),
    R.unless(R.prop('token'), R.assoc('token', uuid()))
  )(prospectUserData);
};

const createAndExecuteQuery = _prospectUserData => {
  const prospectUserData = decorateDataForDbInsertion(_prospectUserData);

  const query = `INSERT INTO ${DB.coreDbName}.prospect_users
                 SET ${DB.prepareProvidedFieldsForSet(prospectUserData)}`;

  const queryStatement = [query, DB.prepareValues(prospectUserData)];
  return DB.query(queryStatement);
};

const createProspectUser = prospectUserData => {
  validateForInsert(R.defaultTo({}, prospectUserData));
  return createAndExecuteQuery(prospectUserData);
};

module.exports = createProspectUser;

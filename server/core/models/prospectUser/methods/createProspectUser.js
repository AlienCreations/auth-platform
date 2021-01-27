'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                       = require('../../../utils/db'),
      validateProspectUserData = require('../helpers/validateProspectUserData').validateForInsert;

const decorateDataForDbInsertion = prospectUserData => {
  return R.compose(
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

/**
 * Create a prospect user record.
 * @param {Object} prospectUserData
 * @returns {Promise}
 */
const createProspectUser = prospectUserData => {
  validateProspectUserData(R.defaultTo({}, prospectUserData));
  return createAndExecuteQuery(prospectUserData);
};

module.exports = createProspectUser;

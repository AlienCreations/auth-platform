'use strict';

const R      = require('ramda'),
      config = require('config');

const DB                    = require('../../../utils/db'),
      passwords             = require('../../../utils/password'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForInsert;

const maybeAddMissingJsonFields = R.compose(
  R.unless(R.has('permissionsJson'), R.assoc('permissionsJson', '{}')),
  R.unless(R.has('authConfig'), R.assoc('authConfig', '{}')),
  R.unless(R.has('strategyRefs'), R.assoc('strategyRefs', '{}')),
  R.unless(R.has('metaJson'), R.assoc('metaJson', '{}'))
);

const saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

const decorateDataForDbInsertion = R.compose(
  R.over(R.lensProp('password'), R.partialRight(passwords.makePasswordHash, [saltRoundsExponent])),
  maybeAddMissingJsonFields
);

const createAndExecuteQuery = cloudUserData => {
  cloudUserData = decorateDataForDbInsertion(cloudUserData);

  const fields = R.keys(cloudUserData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.cloud_users SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(cloudUserData)];
  return DB.query(queryStatement);
};

/**
 * Create a cloud user record.
 * @param {Object} cloudUserData
 * @returns {Promise}
 */
const createCloudUser = cloudUserData => {
  validateCloudUserData(R.defaultTo({}, cloudUserData));
  return createAndExecuteQuery(cloudUserData);
};

module.exports = createCloudUser;

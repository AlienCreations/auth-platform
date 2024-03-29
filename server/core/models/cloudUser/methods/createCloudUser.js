'use strict';

const R      = require('ramda'),
      uuid   = require('uuid/v4'),
      config = require('config');

const DB                    = require('../../../utils/db'),
      passwords             = require('../../../utils/password'),
      validateCloudUserData = require('../helpers/validateCloudUserData').validateForInsert;

const maybeAddMissingJsonFields = R.compose(
  R.unless(R.has('authConfig'), R.assoc('authConfig', '{}')),
  R.unless(R.has('strategyRefs'), R.assoc('strategyRefs', '{}')),
  R.unless(R.has('metaJson'), R.assoc('metaJson', '{}'))
);

const saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid()),
  R.over(R.lensProp('password'), R.partialRight(passwords.makePasswordHash, [saltRoundsExponent])),
  maybeAddMissingJsonFields
)(data);

const createAndExecuteQuery = _cloudUserData => {
  const cloudUserData = decorateDataForDbInsertion(_cloudUserData);

  const query = `INSERT INTO ${DB.coreDbName}.cloud_users
                 SET ${DB.prepareProvidedFieldsForSet(cloudUserData)}`;

  const queryStatement = [query, DB.prepareValues(cloudUserData)];
  return DB.query(queryStatement);
};

const createCloudUser = cloudUserData => {
  validateCloudUserData(R.defaultTo({}, cloudUserData));
  return createAndExecuteQuery(cloudUserData);
};

module.exports = createCloudUser;

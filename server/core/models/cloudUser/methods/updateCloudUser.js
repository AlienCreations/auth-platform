'use strict';

const R      = require('ramda'),
      config = require('config');

const DB                                  = require('../../../utils/db'),
      passwords                           = require('../../../utils/password'),
      getCloudUserByUuid                  = require('../methods/getCloudUserByUuid'),
      PasswordReset                       = require('../../passwordReset/PasswordReset'),
      { validateUuid, validateForUpdate } = require('../helpers/validateCloudUserData');

const maybeClearStalePasswordReset = R.curry((id, cloudUserData) => {
  if (R.has('email', cloudUserData)) {
    return Promise.resolve(id)
      .then(getCloudUserByUuid)
      .then(R.prop('email'))
      .then(PasswordReset.getPasswordResetByEmail)
      .then(R.prop('token'))
      .then(PasswordReset.deletePasswordResetToken)
      .then(R.always(cloudUserData))
      .catch(R.always(cloudUserData));
  } else {
    return Promise.resolve(cloudUserData);
  }
});

const decorateDataForDbInsertion = cloudUserData => {
  const plainTextPassword  = cloudUserData.password || '',
        saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  return R.compose(
    R.when(
      R.prop('password'),
      R.assoc('password', passwords.makePasswordHash(plainTextPassword, saltRoundsExponent))
    )
  )(cloudUserData);
};

const createAndExecuteQuery = R.curry((id, _cloudUserData) => {
  const cloudUserData = decorateDataForDbInsertion(_cloudUserData);

  const query = `UPDATE ${DB.coreDbName}.cloud_users
                 SET ${DB.prepareProvidedFieldsForSet(cloudUserData)}
                 WHERE uuid = ?`;

  const values         = R.append(id, DB.prepareValues(cloudUserData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

const updateCloudUser = R.curry((uuid, cloudUserData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(cloudUserData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(cloudUserData);

  return Promise.resolve(cloudUserData)
    .then(maybeClearStalePasswordReset(uuid))
    .then(createAndExecuteQuery(uuid));
});

module.exports = updateCloudUser;

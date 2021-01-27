'use strict';

const R      = require('ramda'),
      config = require('config');

const DB                    = require('../../../utils/db'),
      passwords             = require('../../../utils/password'),
      getCloudUserById      = require('../methods/getCloudUserById'),
      PasswordReset         = require('../../passwordReset/PasswordReset'),
      validateCloudUserData = require('../helpers/validateCloudUserData');

const maybeClearStalePasswordReset = R.curry((id, cloudUserData) => {
  if (R.has('email', cloudUserData)) {
    return Promise.resolve(id)
      .then(getCloudUserById)
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
                 WHERE id = ?`;

  const values         = R.append(id, DB.prepareValues(cloudUserData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

/**
 * Update a cloud user record.
 * @param {Number} id The affected record id.
 * @param {Object} cloudUserData
 * @returns {Promise}
 */
const updateCloudUser = R.curry((id, cloudUserData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(cloudUserData)) {
    return Promise.resolve(false);
  }

  validateCloudUserData.validateId({ id });
  validateCloudUserData.validateForUpdate(cloudUserData);

  return Promise.resolve(cloudUserData)
    .then(maybeClearStalePasswordReset(id))
    .then(createAndExecuteQuery(id));
});

module.exports = updateCloudUser;

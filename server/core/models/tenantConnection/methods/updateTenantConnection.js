'use strict';

const R = require('ramda');

const DB        = require('../../../utils/db'),
      passwords = require('../../../utils/password');

const {
  validateUuid,
  validateForUpdate
} = require('../helpers/validateTenantConnectionData');

const decorateDataForDbInsertion = connectionData => {
  const TENANT_CONNECTION_ENCRYPTION_KEY = R.path(['env', 'TENANT_CONNECTION_ENCRYPTION_KEY'], process),
        plainTextPassword                = connectionData.password || '';

  return R.compose(
    R.when(
      R.prop('password'),
      R.assoc('password', passwords.encrypt(plainTextPassword, TENANT_CONNECTION_ENCRYPTION_KEY))
    )
  )(connectionData);
};

const createAndExecuteQuery = (uuid, _connectionData) => {
  const connectionData = decorateDataForDbInsertion(_connectionData);

  const query = `UPDATE ${DB.coreDbName}.tenant_connections
                 SET ${DB.prepareProvidedFieldsForSet(connectionData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(connectionData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantConnection = (uuid, connectionData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(connectionData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(connectionData);
  return createAndExecuteQuery(uuid, connectionData);
};

module.exports = R.curry(updateTenantConnection);

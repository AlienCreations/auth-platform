'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      passwords                    = require('../../../utils/password'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData');

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

const createAndExecuteQuery = (id, _connectionData) => {
  const connectionData = decorateDataForDbInsertion(_connectionData);

  const query = `UPDATE ${DB.coreDbName}.tenant_connections
                 SET ${DB.prepareProvidedFieldsForSet(connectionData)}
                 WHERE id = ?`;

  const values         = R.append(id, DB.prepareValues(connectionData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

/**
 * Update a tenant connection record.
 * @param {Number} id
 * @param {Object} connectionData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantConnection = (id, connectionData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(connectionData)) {
    return Promise.resolve(false);
  }

  validateTenantConnectionData.validateId({ id });
  validateTenantConnectionData.validateForUpdate(connectionData);
  return createAndExecuteQuery(id, connectionData);
};

module.exports = R.curry(updateTenantConnection);

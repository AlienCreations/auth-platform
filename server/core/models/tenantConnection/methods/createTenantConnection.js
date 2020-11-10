'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      passwords                    = require('../../../utils/password'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForInsert;

const decorateDataForDbInsertion = connectionData => {
  const TENANT_CONNECTION_ENCRYPTION_KEY = R.path(['env', 'TENANT_CONNECTION_ENCRYPTION_KEY'], process);
  const dataCopy                         = R.clone(connectionData);

  dataCopy.password = passwords.encrypt(dataCopy.password, TENANT_CONNECTION_ENCRYPTION_KEY);

  return dataCopy;
};

const createAndExecuteQuery = _connectionData => {
  const connectionData = decorateDataForDbInsertion(_connectionData);

  const fields = R.keys(connectionData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_connections SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(connectionData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenant connection record.
 * @param {Object} connectionData
 * @returns {Promise}
 */
const createTenantConnection = connectionData => {
  validateTenantConnectionData(R.defaultTo({}, connectionData));
  return createAndExecuteQuery(connectionData);
};

module.exports = createTenantConnection;

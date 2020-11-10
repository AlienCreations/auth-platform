'use strict';

const R = require('ramda');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForInsert;

const decorateDataForDbInsertion = tenantAccessResourceData => {
  const dataCopy = R.clone(tenantAccessResourceData);
  return dataCopy;
};

const createAndExecuteQuery = _tenantAccessResourceData => {
  const tenantAccessResourceData = decorateDataForDbInsertion(_tenantAccessResourceData);

  const fields = R.keys(tenantAccessResourceData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_access_resources SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(tenantAccessResourceData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenantAccessResource record
 * @param {Object} tenantAccessResourceData
 * @throws {Error}
 * @returns {Promise}
 */
const createTenantAccessResource = tenantAccessResourceData => {
  validateTenantAccessResourceData(R.defaultTo({}, tenantAccessResourceData));
  return createAndExecuteQuery(tenantAccessResourceData);
};

module.exports = createTenantAccessResource;

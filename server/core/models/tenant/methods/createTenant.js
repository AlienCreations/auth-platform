'use strict';

const R = require('ramda');

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForInsert;

const decorateDataForDbInsertion = tenantData => {
  const dataCopy     = R.clone(tenantData);
  return dataCopy;
};

const createAndExecuteQuery = _tenantData => {
  const tenantData = decorateDataForDbInsertion(_tenantData);

  const fields = R.keys(tenantData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenants SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(tenantData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenant record.
 * @param {Object} tenantData
 * @returns {Promise}
 */
const createTenant = tenantData => {
  validateTenantData(R.defaultTo({}, tenantData));
  return createAndExecuteQuery(tenantData);
};

module.exports = createTenant;

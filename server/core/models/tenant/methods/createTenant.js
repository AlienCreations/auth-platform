'use strict';

const R = require('ramda');

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForInsert;

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = _tenantData => {
  const tenantData = decorateDataForDbInsertion(_tenantData);

  const query = `INSERT INTO ${DB.coreDbName}.tenants
                 SET ${DB.prepareProvidedFieldsForSet(tenantData)}`;

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

'use strict';

const R = require('ramda');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForInsert;

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = _tenantAccessResourceData => {
  const tenantAccessResourceData = decorateDataForDbInsertion(_tenantAccessResourceData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_resources
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessResourceData)}`;

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

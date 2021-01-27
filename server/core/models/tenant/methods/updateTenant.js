'use strict';

const R = require('ramda');

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (id, _tenantData) => {
  const tenantData = decorateDataForDbInsertion(_tenantData);

  const query = `UPDATE ${DB.coreDbName}.tenants
                 SET ${DB.prepareProvidedFieldsForSet(tenantData)}
                 WHERE id = ?`;

  const values         = R.append(id, DB.prepareValues(tenantData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

/**
 * Update a tenant record.
 * @param {Number} id
 * @param {Object} tenantData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenant = (id, tenantData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantData)) {
    return Promise.resolve(false);
  }

  validateTenantData.validateId({ id });
  validateTenantData.validateForUpdate(tenantData);
  return createAndExecuteQuery(id, tenantData);
};

module.exports = R.curry(updateTenant);

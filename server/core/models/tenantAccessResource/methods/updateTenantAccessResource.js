'use strict';

const R = require('ramda');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (id, _tenantAccessResourceData) => {
  const tenantAccessResourceData = decorateDataForDbInsertion(_tenantAccessResourceData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_resources
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessResourceData)}
                 WHERE id = ?`;

  const values         = R.append(id, DB.prepareValues(tenantAccessResourceData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

/**
 * Update a tenantAccessResource record.
 * @param {Number} id
 * @param {Object} tenantAccessResourceData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantAccessResource = (id, tenantAccessResourceData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessResourceData)) {
    return Promise.resolve(false);
  }

  validateTenantAccessResourceData.validateId({ id });
  validateTenantAccessResourceData.validateForUpdate(tenantAccessResourceData);
  return createAndExecuteQuery(id, tenantAccessResourceData);
};

module.exports = R.curry(updateTenantAccessResource);

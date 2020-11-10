'use strict';

const R = require('ramda');

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData');

const decorateDataForDbInsertion = tenantAccessPermissionData => {
  const dataCopy = R.clone(tenantAccessPermissionData);
  return dataCopy;
};

const createAndExecuteQuery = (id, _tenantAccessPermissionData) => {
  const tenantAccessPermissionData = decorateDataForDbInsertion(_tenantAccessPermissionData);

  const fields = R.keys(tenantAccessPermissionData);

  const query = 'UPDATE ' + DB.coreDbName + '.tenant_access_permissions SET ' +
                DB.prepareProvidedFieldsForSet(fields) + ' ' +
                'WHERE id = ?';

  const values = R.append(id, DB.prepareValues(tenantAccessPermissionData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

/**
 * Update a tenantAccessPermission record.
 * @param {Number} id
 * @param {Object} tenantAccessPermissionData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantAccessPermission = (id, tenantAccessPermissionData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessPermissionData)) {
    return Promise.resolve(false);
  }

  validateTenantAccessPermissionData.validateId({ id });
  validateTenantAccessPermissionData.validateForUpdate(tenantAccessPermissionData);
  return createAndExecuteQuery(id, tenantAccessPermissionData);
};

module.exports = R.curry(updateTenantAccessPermission);

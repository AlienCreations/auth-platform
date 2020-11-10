'use strict';

const R = require('ramda');

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForInsert;

const decorateDataForDbInsertion = tenantAccessPermissionData => {
  const dataCopy = R.clone(tenantAccessPermissionData);
  return dataCopy;
};

const createAndExecuteQuery = _tenantAccessPermissionData => {
  const tenantAccessPermissionData = decorateDataForDbInsertion(_tenantAccessPermissionData);

  const fields = R.keys(tenantAccessPermissionData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_access_permissions SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(tenantAccessPermissionData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenantAccessPermission record
 * @param {Object} tenantAccessPermissionData
 * @throws {Error}
 * @returns {Promise}
 */
const createTenantAccessPermission = tenantAccessPermissionData =>  {
  validateTenantAccessPermissionData(R.defaultTo({}, tenantAccessPermissionData));
  return createAndExecuteQuery(tenantAccessPermissionData);
};

module.exports = createTenantAccessPermission;

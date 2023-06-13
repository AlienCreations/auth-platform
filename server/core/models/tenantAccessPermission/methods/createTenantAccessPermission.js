'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantAccessPermissionData => {
  const tenantAccessPermissionData = decorateDataForDbInsertion(_tenantAccessPermissionData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_permissions
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessPermissionData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessPermissionData)];
  return DB.query(queryStatement);
};

const createTenantAccessPermission = tenantAccessPermissionData => {
  validateTenantAccessPermissionData(R.defaultTo({}, tenantAccessPermissionData));
  return createAndExecuteQuery(tenantAccessPermissionData);
};

module.exports = createTenantAccessPermission;

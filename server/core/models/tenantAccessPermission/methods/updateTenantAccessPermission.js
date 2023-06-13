'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateTenantAccessPermissionData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantAccessPermissionData) => {
  const tenantAccessPermissionData = decorateDataForDbInsertion(_tenantAccessPermissionData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_permissions
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessPermissionData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantAccessPermissionData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantAccessPermission = (uuid, tenantAccessPermissionData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessPermissionData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantAccessPermissionData);
  return createAndExecuteQuery(uuid, tenantAccessPermissionData);
};

module.exports = R.curry(updateTenantAccessPermission);

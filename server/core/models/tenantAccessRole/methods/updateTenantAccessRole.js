'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateTenantAccessRoleData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantAccessRoleData) => {
  const tenantAccessRoleData = decorateDataForDbInsertion(_tenantAccessRoleData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_roles
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantAccessRoleData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantAccessRole = (uuid, tenantAccessRoleData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessRoleData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantAccessRoleData);
  return createAndExecuteQuery(uuid, tenantAccessRoleData);
};

module.exports = R.curry(updateTenantAccessRole);

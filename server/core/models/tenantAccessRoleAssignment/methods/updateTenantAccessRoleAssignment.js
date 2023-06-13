'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateTenantAccessRoleAssignmentData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantAccessRoleAssignmentData) => {
  const tenantAccessRoleAssignmentData = decorateDataForDbInsertion(_tenantAccessRoleAssignmentData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_role_assignments
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleAssignmentData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantAccessRoleAssignmentData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantAccessRoleAssignment = (uuid, tenantAccessRoleAssignmentData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessRoleAssignmentData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantAccessRoleAssignmentData);
  return createAndExecuteQuery(uuid, tenantAccessRoleAssignmentData);
};

module.exports = R.curry(updateTenantAccessRoleAssignment);

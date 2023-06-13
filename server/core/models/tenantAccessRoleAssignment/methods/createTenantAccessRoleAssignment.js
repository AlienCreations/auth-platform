'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantAccessRoleAssignmentData => {
  const tenantAccessRoleAssignmentData = decorateDataForDbInsertion(_tenantAccessRoleAssignmentData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_role_assignments
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleAssignmentData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessRoleAssignmentData)];
  return DB.query(queryStatement);
};

const createTenantAccessRoleAssignment = tenantAccessRoleAssignmentData => {
  validateTenantAccessRoleAssignmentData(R.defaultTo({}, tenantAccessRoleAssignmentData));
  return createAndExecuteQuery(tenantAccessRoleAssignmentData);
};

module.exports = createTenantAccessRoleAssignment;

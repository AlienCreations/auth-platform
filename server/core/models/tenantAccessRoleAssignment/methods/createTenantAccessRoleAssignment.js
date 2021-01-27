'use strict';

const R = require('ramda');

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForInsert;

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = _tenantAccessRoleAssignmentData => {
  const tenantAccessRoleAssignmentData = decorateDataForDbInsertion(_tenantAccessRoleAssignmentData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_role_assignments
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleAssignmentData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessRoleAssignmentData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenantAccessRoleAssignment record
 * @param {Object} tenantAccessRoleAssignmentData
 * @throws {Error}
 * @returns {Promise}
 */
const createTenantAccessRoleAssignment = tenantAccessRoleAssignmentData => {
  validateTenantAccessRoleAssignmentData(R.defaultTo({}, tenantAccessRoleAssignmentData));
  return createAndExecuteQuery(tenantAccessRoleAssignmentData);
};

module.exports = createTenantAccessRoleAssignment;

'use strict';

const R = require('ramda');

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData').validateForInsert;

const decorateDataForDbInsertion = tenantAccessRoleAssignmentData => {
  const dataCopy = R.clone(tenantAccessRoleAssignmentData);
  return dataCopy;
};

const createAndExecuteQuery = _tenantAccessRoleAssignmentData => {
  const tenantAccessRoleAssignmentData = decorateDataForDbInsertion(_tenantAccessRoleAssignmentData);

  const fields = R.keys(tenantAccessRoleAssignmentData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_access_role_assignments SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

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

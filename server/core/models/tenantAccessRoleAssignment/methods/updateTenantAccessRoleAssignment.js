'use strict';

const R = require('ramda');

const DB                                     = require('../../../utils/db'),
      validateTenantAccessRoleAssignmentData = require('../helpers/validateTenantAccessRoleAssignmentData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (id, _tenantAccessRoleAssignmentData) => {
  const tenantAccessRoleAssignmentData = decorateDataForDbInsertion(_tenantAccessRoleAssignmentData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_role_assignments
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleAssignmentData)}
                 WHERE id = ?`;

  const values         = R.append(id, DB.prepareValues(tenantAccessRoleAssignmentData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

/**
 * Update a tenantAccessRoleAssignment record.
 * @param {Number} id
 * @param {Object} tenantAccessRoleAssignmentData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantAccessRoleAssignment = (id, tenantAccessRoleAssignmentData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessRoleAssignmentData)) {
    return Promise.resolve(false);
  }

  validateTenantAccessRoleAssignmentData.validateId({ id });
  validateTenantAccessRoleAssignmentData.validateForUpdate(tenantAccessRoleAssignmentData);
  return createAndExecuteQuery(id, tenantAccessRoleAssignmentData);
};

module.exports = R.curry(updateTenantAccessRoleAssignment);

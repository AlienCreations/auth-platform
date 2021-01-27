'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForInsert;

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = _tenantAccessRoleData => {
  const tenantAccessRoleData = decorateDataForDbInsertion(_tenantAccessRoleData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_roles
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessRoleData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenantAccessRole record
 * @param {Object} tenantAccessRoleData
 * @throws {Error}
 * @returns {Promise}
 */
const createTenantAccessRole = tenantAccessRoleData => {
  validateTenantAccessRoleData(R.defaultTo({}, tenantAccessRoleData));
  return createAndExecuteQuery(tenantAccessRoleData);
};

module.exports = createTenantAccessRole;

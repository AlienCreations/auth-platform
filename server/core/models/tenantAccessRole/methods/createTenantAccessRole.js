'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForInsert;

const decorateDataForDbInsertion = (tenantAccessRoleData) => {
  const dataCopy = R.clone(tenantAccessRoleData);
  return dataCopy;
};

const createAndExecuteQuery = tenantAccessRoleData => {
  tenantAccessRoleData = decorateDataForDbInsertion(tenantAccessRoleData);

  const fields = R.keys(tenantAccessRoleData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_access_roles SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

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

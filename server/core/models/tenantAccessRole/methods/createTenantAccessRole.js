'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantAccessRoleData => {
  const tenantAccessRoleData = decorateDataForDbInsertion(_tenantAccessRoleData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_roles
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessRoleData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessRoleData)];
  return DB.query(queryStatement);
};

const createTenantAccessRole = tenantAccessRoleData => {
  validateTenantAccessRoleData(R.defaultTo({}, tenantAccessRoleData));
  return createAndExecuteQuery(tenantAccessRoleData);
};

module.exports = createTenantAccessRole;

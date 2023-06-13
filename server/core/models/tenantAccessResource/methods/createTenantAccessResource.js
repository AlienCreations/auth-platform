'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantAccessResourceData => {
  const tenantAccessResourceData = decorateDataForDbInsertion(_tenantAccessResourceData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_access_resources
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessResourceData)}`;

  const queryStatement = [query, DB.prepareValues(tenantAccessResourceData)];
  return DB.query(queryStatement);
};

const createTenantAccessResource = tenantAccessResourceData => {
  validateTenantAccessResourceData(R.defaultTo({}, tenantAccessResourceData));
  return createAndExecuteQuery(tenantAccessResourceData);
};

module.exports = createTenantAccessResource;

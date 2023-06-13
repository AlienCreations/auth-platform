'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                 = require('../../../utils/db'),
      validateTenantData = require('../helpers/validateTenantData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantData => {
  const tenantData = decorateDataForDbInsertion(_tenantData);

  const query = `INSERT INTO ${DB.coreDbName}.tenants
                 SET ${DB.prepareProvidedFieldsForSet(tenantData)}`;

  const queryStatement = [query, DB.prepareValues(tenantData)];
  return DB.query(queryStatement);
};

const createTenant = tenantData => {
  validateTenantData(R.defaultTo({}, tenantData));
  return createAndExecuteQuery(tenantData);
};

module.exports = createTenant;

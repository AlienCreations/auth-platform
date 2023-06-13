'use strict';

const R = require('ramda');

const DB = require('../../../utils/db');

const {
  validateUuid,
  validateForUpdate
} = require('../helpers/validateTenantAccessResourceData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantAccessResourceData) => {
  const tenantAccessResourceData = decorateDataForDbInsertion(_tenantAccessResourceData);

  const query = `UPDATE ${DB.coreDbName}.tenant_access_resources
                 SET ${DB.prepareProvidedFieldsForSet(tenantAccessResourceData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantAccessResourceData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantAccessResource = (uuid, tenantAccessResourceData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessResourceData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantAccessResourceData);
  return createAndExecuteQuery(uuid, tenantAccessResourceData);
};

module.exports = R.curry(updateTenantAccessResource);

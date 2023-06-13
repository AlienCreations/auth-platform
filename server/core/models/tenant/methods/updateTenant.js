'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateTenantData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantData) => {
  const tenantData = decorateDataForDbInsertion(_tenantData);

  const query = `UPDATE ${DB.coreDbName}.tenants
                 SET ${DB.prepareProvidedFieldsForSet(tenantData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenant = (uuid, tenantData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantData);
  return createAndExecuteQuery(uuid, tenantData);
};

module.exports = R.curry(updateTenant);

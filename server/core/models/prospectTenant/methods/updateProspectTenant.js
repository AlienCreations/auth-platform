'use strict';

const R = require('ramda');

const DB = require('../../../utils/db'),
      {
        validateUuid,
        validateForUpdate
      }  = require('../helpers/validateProspectTenantData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = R.curry((uuid, _prospectTenantData) => {
  const prospectTenantData = decorateDataForDbInsertion(_prospectTenantData);

  const query = `UPDATE ${DB.coreDbName}.prospect_tenants
                 SET ${DB.prepareProvidedFieldsForSet(prospectTenantData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(prospectTenantData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

const updateProspectTenant = R.curry((uuid, prospectTenantData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(prospectTenantData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(prospectTenantData);

  return Promise.resolve(prospectTenantData)
    .then(createAndExecuteQuery(uuid));
});

module.exports = updateProspectTenant;

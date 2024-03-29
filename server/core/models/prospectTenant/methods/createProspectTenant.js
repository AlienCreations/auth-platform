'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForInsert;

const decorateDataForDbInsertion = prospectTenantData => {
  return R.compose(
    R.assoc('uuid', uuid()),
    R.unless(R.prop('token'), R.assoc('token', uuid()))
  )(prospectTenantData);
};

const createAndExecuteQuery = _prospectTenantData => {
  const prospectTenantData = decorateDataForDbInsertion(_prospectTenantData);

  const query = `INSERT INTO ${DB.coreDbName}.prospect_tenants
                 SET ${DB.prepareProvidedFieldsForSet(prospectTenantData)}`;

  const queryStatement = [query, DB.prepareValues(prospectTenantData)];
  return DB.query(queryStatement);
};

const createProspectTenant = prospectTenantData => {
  validateProspectTenantData(R.defaultTo({}, prospectTenantData));
  return createAndExecuteQuery(prospectTenantData);
};

module.exports = createProspectTenant;

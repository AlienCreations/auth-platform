'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForInsert;

const decorateDataForDbInsertion = prospectTenantData => {
  const dataCopy = R.clone(prospectTenantData);
  dataCopy.token = prospectTenantData.token || uuid();
  return dataCopy;
};

const createAndExecuteQuery = _prospectTenantData => {
  const prospectTenantData = decorateDataForDbInsertion(_prospectTenantData);

  const fields = R.keys(prospectTenantData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.prospect_tenants SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(prospectTenantData)];
  return DB.query(queryStatement);
};

/**
 * Create a prospect tenant record.
 * @param {Object} prospectTenantData
 * @returns {Promise}
 */
const createProspectTenant = prospectTenantData => {
  validateProspectTenantData(R.defaultTo({}, prospectTenantData));
  return createAndExecuteQuery(prospectTenantData);
};

module.exports = createProspectTenant;

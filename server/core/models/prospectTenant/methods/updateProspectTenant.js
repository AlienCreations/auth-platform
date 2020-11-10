'use strict';

const R = require('ramda');

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData');


const decorateDataForDbInsertion = (prospectTenantData) => {
  const dataCopy = R.clone(prospectTenantData);
  return dataCopy;
};

const createAndExecuteQuery = R.curry((id, _prospectTenantData) => {
  const prospectTenantData = decorateDataForDbInsertion(_prospectTenantData);

  const fields = R.keys(prospectTenantData);
  const query  = 'UPDATE ' + DB.coreDbName + '.prospect_tenants SET ' +
                 DB.prepareProvidedFieldsForSet(fields) + ' ' +
                 'WHERE id = ?';
  const values = R.append(id, DB.prepareValues(prospectTenantData));

  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

/**
 * Update a prospect tenant record.
 * @param {Number} id The affected record id.
 * @param {Object} prospectTenantData
 * @returns {Promise}
 */
const updateProspectTenant = R.curry((id, prospectTenantData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(prospectTenantData)) {
    return Promise.resolve(false);
  }

  validateProspectTenantData.validateId({ id });
  validateProspectTenantData.validateForUpdate(prospectTenantData);

  return Promise.resolve(prospectTenantData)
    .then(createAndExecuteQuery(id));
});

module.exports = updateProspectTenant;

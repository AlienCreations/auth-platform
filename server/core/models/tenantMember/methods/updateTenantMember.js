'use strict';

const R = require('ramda');

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData');

const decorateDataForDbInsertion = tenantMemberData => {
  const dataCopy = R.clone(tenantMemberData);
  return dataCopy;
};

const createAndExecuteQuery = (id, _tenantMemberData) => {
  const tenantMemberData = decorateDataForDbInsertion(_tenantMemberData);

  const fields = R.keys(tenantMemberData);

  const query = 'UPDATE ' + DB.coreDbName + '.tenant_members SET ' +
                DB.prepareProvidedFieldsForSet(fields) + ' ' +
                'WHERE id = ?';

  const values = R.append(id, DB.prepareValues(tenantMemberData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

/**
 * Update a tenantMember record.
 * @param {Number} id
 * @param {Object} tenantMemberData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantMember = (id, tenantMemberData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantMemberData)) {
    return Promise.resolve(false);
  }

  validateTenantMemberData.validateId({ id });
  validateTenantMemberData.validateForUpdate(tenantMemberData);
  return createAndExecuteQuery(id, tenantMemberData);
};

module.exports = R.curry(updateTenantMember);

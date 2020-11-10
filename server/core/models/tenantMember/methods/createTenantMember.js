'use strict';

const R = require('ramda');

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForInsert;

const decorateDataForDbInsertion = tenantMemberData => {
  const dataCopy = R.clone(tenantMemberData);
  return dataCopy;
};

const createAndExecuteQuery = _tenantMemberData => {
  const tenantMemberData = decorateDataForDbInsertion(_tenantMemberData);

  const fields = R.keys(tenantMemberData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_members SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(tenantMemberData)];
  return DB.query(queryStatement);
};

/**
 * Create a tenantMember record
 * @param {Object} tenantMemberData
 * @throws {Error}
 * @returns {Promise}
 */
const createTenantMember = tenantMemberData => {
  validateTenantMemberData(R.defaultTo({}, tenantMemberData));
  return createAndExecuteQuery(tenantMemberData);
};

module.exports = createTenantMember;

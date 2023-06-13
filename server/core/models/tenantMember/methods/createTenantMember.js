'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _tenantMemberData => {
  const tenantMemberData = decorateDataForDbInsertion(_tenantMemberData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_members
                 SET ${DB.prepareProvidedFieldsForSet(tenantMemberData)}`;

  const queryStatement = [query, DB.prepareValues(tenantMemberData)];
  return DB.query(queryStatement);
};

const createTenantMember = tenantMemberData => {
  validateTenantMemberData(R.defaultTo({}, tenantMemberData));
  return createAndExecuteQuery(tenantMemberData);
};

module.exports = createTenantMember;

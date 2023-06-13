'use strict';

const R = require('ramda');

const DB = require('../../../utils/db');

const {
  validateUuid,
  validateForUpdate
}  = require('../helpers/validateTenantMemberData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _tenantMemberData) => {
  const tenantMemberData = decorateDataForDbInsertion(_tenantMemberData);

  const query = `UPDATE ${DB.coreDbName}.tenant_members
                 SET ${DB.prepareProvidedFieldsForSet(tenantMemberData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(tenantMemberData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantMember = (uuid, tenantMemberData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantMemberData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(tenantMemberData);
  return createAndExecuteQuery(uuid, tenantMemberData);
};

module.exports = R.curry(updateTenantMember);

'use strict';

const R      = require('ramda'),
      config = require('config');

const DB        = require('../../../utils/db'),
      passwords = require('../../../utils/password');

const {
  validateUuid,
  validateForUpdate
} = require('../helpers/validateTenantOrganizationData');

const decorateDataForDbInsertion = organizationData => {
  const plainTextPassword  = organizationData.password || '',
        saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  return R.compose(
    R.when(
      R.prop('password'),
      R.assoc('password', passwords.makePasswordHash(plainTextPassword, saltRoundsExponent))
    )
  )(organizationData);
};

const createAndExecuteQuery = (uuid, _organizationData) => {
  const organizationData = decorateDataForDbInsertion(_organizationData);

  const query = `UPDATE ${DB.coreDbName}.tenant_organizations
                 SET ${DB.prepareProvidedFieldsForSet(organizationData)}
                 WHERE uuid = ?`;

  const values         = R.append(uuid, DB.prepareValues(organizationData));
  const queryStatement = [query, values];

  return DB.query(queryStatement);
};

const updateTenantOrganization = (uuid, organizationData) => {
  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(organizationData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(organizationData);
  return createAndExecuteQuery(uuid, organizationData);
};

module.exports = R.curry(updateTenantOrganization);

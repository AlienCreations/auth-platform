'use strict';

const R      = require('ramda'),
      config = require('config'),
      uuid   = require('uuid/v4');

const DB                             = require('../../../utils/db'),
      passwordUtils                  = require('../../../utils/password'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForInsert;

const decorateDataForDbInsertion = organizationData => {
  const saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  return R.compose(
    R.assoc('uuid', uuid()),
    R.assoc('password', passwordUtils.makePasswordHash(organizationData.password, saltRoundsExponent))
  )(organizationData);
};

const createAndExecuteQuery = _organizationData => {
  const organizationData = decorateDataForDbInsertion(_organizationData);

  const query = `INSERT INTO ${DB.coreDbName}.tenant_organizations
                 SET ${DB.prepareProvidedFieldsForSet(organizationData)}`;

  const queryStatement = [query, DB.prepareValues(organizationData)];
  return DB.query(queryStatement);
};

const createTenantOrganization = organizationData => {
  validateTenantOrganizationData(R.defaultTo({}, organizationData));
  return createAndExecuteQuery(organizationData);
};

module.exports = createTenantOrganization;

'use strict';

const R      = require('ramda'),
      config = require('config');

const DB                             = require('../../../utils/db'),
      passwordUtils                  = require('../../../utils/password'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForInsert;

const decorateDataForDbInsertion = organizationData => {
  const saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  return R.compose(
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

/**
 * Create a tenant organization record.
 * @param {Object} organizationData
 * @returns {Promise}
 */
const createTenantOrganization = organizationData => {
  validateTenantOrganizationData(R.defaultTo({}, organizationData));
  return createAndExecuteQuery(organizationData);
};

module.exports = createTenantOrganization;

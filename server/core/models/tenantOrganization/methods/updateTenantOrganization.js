'use strict';

const R      = require('ramda'),
      config = require('config');

const DB                             = require('../../../utils/db'),
      passwords                      = require('../../../utils/password'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData');

const decorateDataForDbInsertion = organizationData => {
  const dataCopy           = R.clone(organizationData),
        plainTextPassword  = dataCopy.password,
        saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  if (plainTextPassword) {
    dataCopy.password = passwords.makePasswordHash(plainTextPassword, saltRoundsExponent);
  }

  return dataCopy;
};

const createAndExecuteQuery = (id, _organizationData) => {
  const organizationData = decorateDataForDbInsertion(_organizationData);

  const fields = R.keys(organizationData);

  const query = 'UPDATE ' + DB.coreDbName + '.tenant_organizations SET ' +
    DB.prepareProvidedFieldsForSet(fields) + ' ' +
    'WHERE id = ?';

  const values = R.append(id, DB.prepareValues(organizationData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

/**
 * Update a tenant organization record.
 * @param {Number} id
 * @param {Object} organizationData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantOrganization = (id, organizationData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(organizationData)) {
    return Promise.resolve(false);
  }

  validateTenantOrganizationData.validateId({ id });
  validateTenantOrganizationData.validateForUpdate(organizationData);
  return createAndExecuteQuery(id, organizationData);
};

module.exports = R.curry(updateTenantOrganization);

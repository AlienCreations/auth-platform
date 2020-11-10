'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      validateTenantAccessRoleData = require('../helpers/validateTenantAccessRoleData');

const decorateDataForDbInsertion = tenantAccessRoleData => {
  const dataCopy = R.clone(tenantAccessRoleData);
  return dataCopy;
};

const createAndExecuteQuery = (id, _tenantAccessRoleData) => {
  const tenantAccessRoleData = decorateDataForDbInsertion(_tenantAccessRoleData);

  const fields = R.keys(tenantAccessRoleData);

  const query = 'UPDATE ' + DB.coreDbName + '.tenant_access_roles SET ' +
                DB.prepareProvidedFieldsForSet(fields) + ' ' +
                'WHERE id = ?';

  const values = R.append(id, DB.prepareValues(tenantAccessRoleData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

/**
 * Update a tenantAccessRole record.
 * @param {Number} id
 * @param {Object} tenantAccessRoleData
 * @throws {Error}
 * @returns {Promise}
 */
const updateTenantAccessRole = (id, tenantAccessRoleData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(tenantAccessRoleData)) {
    return Promise.resolve(false);
  }

  validateTenantAccessRoleData.validateId({ id });
  validateTenantAccessRoleData.validateForUpdate(tenantAccessRoleData);
  return createAndExecuteQuery(id, tenantAccessRoleData);
};

module.exports = R.curry(updateTenantAccessRole);

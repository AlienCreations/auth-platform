'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const _getProspectTenantByEmail = require('../../../models/prospectTenant/methods/getProspectTenantByEmail');

/**
 * Get a prospectTenant by his/her email from the database
 * @param {String} email
 */
const getProspectTenantByEmail = email => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

  return Promise.resolve(R.defaultTo(undefined, email))
    .then(_getProspectTenantByEmail)
    .then(R.omit(privateFields));
};

module.exports = getProspectTenantByEmail;

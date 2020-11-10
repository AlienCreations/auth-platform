'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const _getProspectTenantByEmailAndToken = require('../../../models/prospectTenant/methods/getProspectTenantByEmailAndToken');

/**
 * Get a prospectTenant by his/her email from the database
 * @param {String} email
 * @param {String} token
 */
const getProspectTenantByEmailAndToken = (email, token) => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

  return Promise.resolve()
    .then(() => _getProspectTenantByEmailAndToken(email, token))
    .then(R.omit(privateFields));
};

module.exports = getProspectTenantByEmailAndToken;

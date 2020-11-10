'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const _getTenantByDomain = require('../../../models/tenant/methods/getTenantByDomain');

/**
 * Get a tenant by domain from the database
 * @param {String} domain
 */
const getTenantByDomain = domain => Promise.resolve(domain)
  .then(_getTenantByDomain)
  .then(R.omit(privateFields));

module.exports = getTenantByDomain;

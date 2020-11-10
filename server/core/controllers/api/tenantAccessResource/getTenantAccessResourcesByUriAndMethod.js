'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourcesByUriAndMethod = require('../../../models/tenantAccessResource/methods/getTenantAccessResourcesByUriAndMethod');

/**
 * Get a tenantAccessResource by uri,method from the database
 * @param {String} uri
 * @param {String} method
 */
const getTenantAccessResourcesByUriAndMethod = (uri, method) => {
  return Promise.resolve()
    .then(() => _getTenantAccessResourcesByUriAndMethod(uri, method))
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessResourcesByUriAndMethod;

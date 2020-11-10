'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourceByKey = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceByKey');

/**
 * Get a tenantAccessResource by key from the database
 * @param {String} key
 */
const getTenantAccessResourceByKey = key => Promise.resolve(key)
  .then(_getTenantAccessResourceByKey)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessResourceByKey;

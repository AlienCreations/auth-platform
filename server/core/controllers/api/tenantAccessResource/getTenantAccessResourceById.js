'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourceById = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceById');

/**
 * Get a tenantAccessResource by id from the database
 * @param {Number} id
 */
const getTenantAccessResourceById = id => Promise.resolve(id)
  .then(_getTenantAccessResourceById)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessResourceById;

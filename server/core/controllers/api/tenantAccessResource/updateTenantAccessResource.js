'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessResource  = require('../../../models/tenantAccessResource/methods/updateTenantAccessResource'),
      _getTenantAccessResourceById = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceById');

/**
 * Update a tenantAccessResource record
 * @param {Object} tenantAccessResourceData
 * @param {Number} id
 */
const updateTenantAccessResource = (tenantAccessResourceData, id) => {
  return Promise.resolve(tenantAccessResourceData)
    .then(_updateTenantAccessResource(id))
    .then(R.always(id))
    .then(_getTenantAccessResourceById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessResource;

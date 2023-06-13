'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createTenantAccessResource = require('../../../models/tenantAccessResource/methods/createTenantAccessResource'),
      getTenantAccessResourceById = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceById');

const createTenantAccessResource = tenantAccessResourceData => {
  return Promise.resolve(tenantAccessResourceData)
    .then(_createTenantAccessResource)
    .then(R.prop('insertId'))
    .then(getTenantAccessResourceById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = createTenantAccessResource;

'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleById = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleById');

const getTenantAccessRoleById = id => Promise.resolve(id)
  .then(_getTenantAccessRoleById)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessRoleById;

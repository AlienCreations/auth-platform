'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByCloudUserUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByCloudUserUuid');

const getTenantAccessRoleAssignmentsByCloudUserUuid = cloudUserUuid => {
  return Promise.resolve(cloudUserUuid)
    .then(_getTenantAccessRoleAssignmentsByCloudUserUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByCloudUserUuid;

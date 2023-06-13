'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMembersByTenantUuid = require('../../../models/tenantMember/methods/getTenantMembersByTenantUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const getTenantMembersByTenantUuid = tenantUuid => Promise.resolve(tenantUuid)
  .then(_getTenantMembersByTenantUuid)
  .then(R.map(R.omit(privateFields)));

module.exports = getTenantMembersByTenantUuid;

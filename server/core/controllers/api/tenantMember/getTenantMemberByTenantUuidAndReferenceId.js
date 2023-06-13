'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMemberByTenantUuidAndReferenceId = require('../../../models/tenantMember/methods/getTenantMemberByTenantUuidAndReferenceId');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const getTenantMemberByTenantUuidAndReferenceId = (tenantId, referenceId) => {
  return Promise.resolve(referenceId)
    .then(_getTenantMemberByTenantUuidAndReferenceId(tenantId))
    .then(R.omit(privateFields));
};

module.exports = getTenantMemberByTenantUuidAndReferenceId;

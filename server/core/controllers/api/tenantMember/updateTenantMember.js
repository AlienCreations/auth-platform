'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantMember   = require('../../../models/tenantMember/methods/updateTenantMember'),
      getTenantMemberByUuid = require('../../../models/tenantMember/methods/getTenantMemberByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const updateTenantMember = (tenantMemberData, uuid) => {
  return Promise.resolve(tenantMemberData)
    .then(_updateTenantMember(uuid))
    .then(R.always(uuid))
    .then(getTenantMemberByUuid)
    .then(R.omit(privateFields));
};

module.exports = updateTenantMember;

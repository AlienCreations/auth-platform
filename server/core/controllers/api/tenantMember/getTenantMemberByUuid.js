'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMemberByUuid = require('../../../models/tenantMember/methods/getTenantMemberByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const getTenantMemberByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantMemberByUuid)
  .then(R.omit(privateFields));

module.exports = getTenantMemberByUuid;

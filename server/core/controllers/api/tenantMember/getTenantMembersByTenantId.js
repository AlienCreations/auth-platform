'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMembersByTenantId = require('../../../models/tenantMember/methods/getTenantMembersByTenantId');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

/**
 * Get all members under a tenant from the database
 * @param {Number} tenantId
 */
const getTenantMembersByTenantId = tenantId => Promise.resolve(tenantId)
  .then(_getTenantMembersByTenantId)
  .then(R.map(R.omit(privateFields)));

module.exports = getTenantMembersByTenantId;

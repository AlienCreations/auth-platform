'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantMember = require('../../../models/tenantMember/methods/updateTenantMember'),
      getTenantMemberById = require('../../../models/tenantMember/methods/getTenantMemberById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

/**
 * Update a tenantMember record
 * @param {Object} tenantMemberData
 * @param {Number} id
 */
const updateTenantMember = (tenantMemberData, id) => {
  return Promise.resolve(tenantMemberData)
    .then(_updateTenantMember(id))
    .then(R.always(id))
    .then(getTenantMemberById)
    .then(R.omit(privateFields));
};

module.exports = updateTenantMember;

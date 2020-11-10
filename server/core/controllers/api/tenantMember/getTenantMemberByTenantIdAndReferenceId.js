'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMemberByTenantIdAndReferenceId = require('../../../models/tenantMember/methods/getTenantMemberByTenantIdAndReferenceId');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

/**
 * Get a tenantMember by tenantId and referenceId from the database
 * @param {Number} tenantId
 * @param {String} referenceId
 */
const getTenantMemberByTenantIdAndReferenceId = (tenantId, referenceId) => {
  return Promise.resolve(referenceId)
    .then(_getTenantMemberByTenantIdAndReferenceId(tenantId))
    .then(R.omit(privateFields));
};

module.exports = getTenantMemberByTenantIdAndReferenceId;

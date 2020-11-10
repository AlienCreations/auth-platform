'use strict';

const R      = require('ramda'),
      config = require('config');

const _getTenantMemberById = require('../../../models/tenantMember/methods/getTenantMemberById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

/**
 * Get a tenantMember by id from the database
 * @param {Number} id
 */
const getTenantMemberById = id => Promise.resolve(id)
  .then(_getTenantMemberById)
  .then(R.omit(privateFields));

module.exports = getTenantMemberById;

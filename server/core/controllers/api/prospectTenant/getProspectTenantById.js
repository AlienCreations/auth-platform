'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const _getProspectTenantById = require('../../../models/prospectTenant/methods/getProspectTenantById');

/**
 * Get a prospectTenant by his/her id from the database
 * @param {Number} id
 */
const getProspectTenantById = id => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

  return Promise.resolve(id)
    .then(_getProspectTenantById)
    .then(R.omit(privateFields));
};

module.exports = getProspectTenantById;

'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateProspectTenant = require('../../../models/prospectTenant/methods/updateProspectTenant'),
      getProspectTenantById = require('../../../models/prospectTenant/methods/getProspectTenantById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS)
);

/**
 * Update a prospectTenant record
 * @param {Object} prospectTenantData
 * @param {Number} id
 */
const updateProspectTenant = R.curry((prospectTenantData, id) => {
  return Promise.resolve(prospectTenantData)
    .then(_updateProspectTenant(id))
    .then(R.always(id))
    .then(getProspectTenantById)
    .then(R.omit(privateFields));
});

module.exports = updateProspectTenant;

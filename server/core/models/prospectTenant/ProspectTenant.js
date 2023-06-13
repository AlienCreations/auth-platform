'use strict';

module.exports = {
  createProspectTenant     : require('./methods/createProspectTenant'),
  getProspectTenantByEmail : require('./methods/getProspectTenantByEmail'),
  getProspectTenantById    : require('./methods/getProspectTenantById'),
  getProspectTenantByUuid  : require('./methods/getProspectTenantByUuid'),
  updateProspectTenant     : require('./methods/updateProspectTenant')
};

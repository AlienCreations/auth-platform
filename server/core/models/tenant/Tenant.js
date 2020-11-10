'use strict';

module.exports = {
  createTenant           : require('./methods/createTenant'),
  getActiveOrganizations : require('./methods/getActiveOrganizations'),
  getAllTenants          : require('./methods/getAllTenants'),
  getTenantByDomain      : require('./methods/getTenantByDomain'),
  getTenantById          : require('./methods/getTenantById'),
  updateTenant           : require('./methods/updateTenant')
};

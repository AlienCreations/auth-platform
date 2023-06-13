'use strict';

module.exports = {
  createTenant      : require('./methods/createTenant'),
  getAllTenants     : require('./methods/getAllTenants'),
  getTenantByDomain : require('./methods/getTenantByDomain'),
  getTenantById     : require('./methods/getTenantById'),
  getTenantByUuid   : require('./methods/getTenantByUuid'),
  updateTenant      : require('./methods/updateTenant')
};

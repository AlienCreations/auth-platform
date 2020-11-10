'use strict';

module.exports = {
  createTenantAccessResource             : require('./methods/createTenantAccessResource'),
  deleteTenantAccessResource             : require('./methods/deleteTenantAccessResource'),
  getTenantAccessResourceById            : require('./methods/getTenantAccessResourceById'),
  getTenantAccessResourceByKey           : require('./methods/getTenantAccessResourceByKey'),
  getTenantAccessResourcesByUriAndMethod : require('./methods/getTenantAccessResourcesByUriAndMethod'),
  updateTenantAccessResource             : require('./methods/updateTenantAccessResource')
};

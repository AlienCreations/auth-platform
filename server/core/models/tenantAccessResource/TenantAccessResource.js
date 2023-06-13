'use strict';

module.exports = {
  createTenantAccessResource             : require('./methods/createTenantAccessResource'),
  deleteTenantAccessResource             : require('./methods/deleteTenantAccessResource'),
  getTenantAccessResourceById            : require('./methods/getTenantAccessResourceById'),
  getTenantAccessResourcesByIds          : require('./methods/getTenantAccessResourcesByIds'),
  getTenantAccessResourceByUuid          : require('./methods/getTenantAccessResourceByUuid'),
  getTenantAccessResourcesByUuids        : require('./methods/getTenantAccessResourcesByUuids'),
  getTenantAccessResourceByKey           : require('./methods/getTenantAccessResourceByKey'),
  getTenantAccessResourcesByUriAndMethod : require('./methods/getTenantAccessResourcesByUriAndMethod'),
  updateTenantAccessResource             : require('./methods/updateTenantAccessResource')
};

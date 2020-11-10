'use strict';

const R = require('ramda');

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForGetByTenantIdAndSubdomain;

const createAndExecuteQuery = (tenantId, subdomain) => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_organizations WHERE tenant_id = ? AND subdomain = ? LIMIT 1',
        queryStatement = [query, [tenantId, subdomain]];

  return DB.lookup(queryStatement);
};

/**
 * Select organizations data for a provided tenant.
 * @param {Number} tenantId
 * @param {String} subdomain
 * @returns {Promise}
 */
const getTenantOrganizationByTenantIdAndSubdomain = R.curry((tenantId, subdomain) => {
  validateTenantOrganizationData({ tenantId, subdomain });
  return createAndExecuteQuery(tenantId, subdomain);
});

module.exports = getTenantOrganizationByTenantIdAndSubdomain;

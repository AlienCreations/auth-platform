'use strict';

const R = require('ramda');

const DB                                         = require('../../../utils/db'),
      { validateForGetByTenantUuidAndSubdomain } = require('../helpers/validateTenantOrganizationData');

const createAndExecuteQuery = (tenantUuid, subdomain) => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE tenant_uuid = ? 
                            AND subdomain = ?
                            AND status > 0 
                          LIMIT 1`,
        queryStatement = [query, [tenantUuid, subdomain]];

  return DB.lookup(queryStatement);
};

const getTenantOrganizationByTenantUuidAndSubdomain = R.curry((tenantUuid, subdomain) => {
  validateForGetByTenantUuidAndSubdomain({ tenantUuid, subdomain });
  return createAndExecuteQuery(tenantUuid, subdomain);
});

module.exports = getTenantOrganizationByTenantUuidAndSubdomain;

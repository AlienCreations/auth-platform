'use strict';

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByKey;

const createAndExecuteQuery = key => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_access_resources WHERE `key` = ? AND status > 0',
        queryStatement = [query, [key]];

  return DB.lookup(queryStatement);
};

const getTenantAccessResourceByKey = key => {
  validateTenantAccessResourceData({ key });
  return createAndExecuteQuery(key);
};

module.exports = getTenantAccessResourceByKey;

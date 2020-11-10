'use strict';

const DB = require('../../../utils/db');

/**
 * Select organizations data.
 * @returns {Promise}
 */
const getActiveOrganizations = () => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_organizations WHERE status = 1 ORDER BY city ASC',
        queryStatement = [query, []];

  return DB.query(queryStatement);
};

module.exports = getActiveOrganizations;

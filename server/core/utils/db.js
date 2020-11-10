'use strict';

const mysql             = require('mysql'),
      config            = require('config'),
      mysqlConnector    = require('@aliencreations/node-mysql-connector'),
      { error, errors } = require('@aliencreations/node-error');

const fetchSecretsAndApplyToEnv = require('../../../scripts/fetchSecretsAndApplyToEnv');
const logger                    = require('../services/log/Log')({});

let DB, dbPool;

const onError = err => {
  if (err.code === errors.db.ACCESS_DENIED().code) {
    logger.warn(error(errors.db.ACCESS_DENIED({
      debug : {
        originalError : err,
        context       : 'This error is likely a byproduct of the password rotation lambda and most often can be disregarded'
      }
    })));

    fetchSecretsAndApplyToEnv()
      .then(() => dbPool.config.connectionConfig.password = process.env.CORE_DB_PASSWORD);
  }
};

dbPool = mysql.createPool(config.db.mysql.poolConfig(process.env.CORE_DB_PASSWORD));
DB     = mysqlConnector(dbPool, onError);

const getDbNameForQuery = service => '`' + process.env[service.toUpperCase() + '_DB_NAME'] + '`';

// DB.otherDbName = getDbNameForQuery('other');
DB.coreDbName = getDbNameForQuery('core');
DB.dbPool     = dbPool;

module.exports = DB;

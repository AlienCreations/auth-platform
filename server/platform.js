'use strict';

const R      = require('ramda'),
      config = require('config'),
      http   = require('http');

const fetchSecretsAndApplyToEnv        = require('../scripts/fetchSecretsAndApplyToEnv'),
      startBatchProcessSearchHeartbeat = require('../scripts/startBatchProcessSearchHeartbeat'),
      logger                           = require('./core/services/log/Log')({}),
      DB                               = require('./core/utils/db');

const Search = require('./core/services/search/Search')(config.search.strategy);

const nodePorts = config.server.nodePorts;

const ONCE_PER_DAY = 86400000;

const startServerOnPort = core => port => {
  let server = http.createServer(core).listen(port);

  /*
    headersTimeout must be longer than keepAliveTimeout. if headers are broken across packets, it is possible
    that the keepalive expires after the first set of headers are accepted, which means the upstream LB will
    receive a TCP RST, breaking the connection and causing a 502.

    https://github.com/nodejs/node/issues/27363
  */
  const { server : { keepAlive } } = config;

  server.headersTimeout   = keepAlive + 1000;
  server.keepAliveTimeout = keepAlive;

  logger.info({ msg : `Server started and listening on port ${port}` });
};

const startServers = core => R.forEach(startServerOnPort(core));

const applyNewDbPasswordToCurrentConnectionPool = () => DB.dbPool.config.connectionConfig.password = process.env.CORE_DB_PASSWORD;

logger.info({ msg : '* Starting servers...' });

const loadSearchServer = searchSvc => Promise.all(R.map(searchSvc.putMapping, config.search.mappings));

try {
  loadSearchServer(Search)
    .then(() => fetchSecretsAndApplyToEnv()
      .then(() => startBatchProcessSearchHeartbeat())
      .then(() => {
        const core = require('./core/core');
        return startServers(core)(nodePorts);
      })
      .then(() => setInterval(() => {
        return fetchSecretsAndApplyToEnv()
          .then(applyNewDbPasswordToCurrentConnectionPool)
          .catch(logger.err);
      }, ONCE_PER_DAY))
      .catch(err => {
        logger.err(err);
        process.exit(1);
      }));

  setInterval(() => {
    Promise.resolve()
      .then(Search.batchProcess(Infinity))
      .then(() => logger.info('search updated'))
      .catch(logger.err);
  }, 5000);

  if (process.env.ALLOW_DEBUG === 'true') {
    logger.info({ env : process.env });
    logger.info({ config });
  }
} catch (err) {
  logger.err(err);
  process.exit(1);
}

#!/usr/bin/env bash

set -a
. ./run/env/demo/.env
set +a

set -a
. ./.env
set +a

echo FLUSHALL | redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" -a "${REDIS_PASSWORD}"

node << EOF
  const resetMySqlFirst     = require('./scripts/resetAndSeedTables').init('coreDb', process.env.PERSIST).reset,
        storeInitialSecrets = require('./scripts/storeInitialSecrets'),
        syncSearch          = require('./server/core/controllers/api/search/sync');

  require('events').EventEmitter.prototype._maxListeners = 500;

  Promise.resolve()
    .then(storeInitialSecrets)
    .then(resetMySqlFirst)
    .then(() => {
      require('./server/platform.js');
      setTimeout(syncSearch, 2000);
      console.log('Started core.js...demo platform server is running.');
    }).catch(err => {
      console.error('Could not start core.js. Error: ', err);
      process.exit();
    });
EOF

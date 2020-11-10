#!/usr/bin/env bash

export PERSIST=$1

if [ "$2" ]; then
  set -a
  . ./run/env/${2}/.env
  set +a

  set -a
  . ./.env
  set +a
fi;

node << EOF
  const resetAndSeedTables = require('./scripts/resetAndSeedTables').init('coreDb', process.env.PERSIST);

  Promise.resolve()
    .then(resetAndSeedTables.reset)
    .then(() => {
      console.log('Reset and seeded!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Reset and seed failed!');
      console.error(err);
      process.exit(1);
    })
EOF

'use strict';

const fs        = require('fs'),
      path      = require('path'),
      reporters = require('jasmine-reporters');

require('dotenv-safe').config({
  path             : path.resolve(__dirname, `../../run/env/${process.env.NODE_ENV}/.env`),
  allowEmptyValues : true
});

const junitReporter = new reporters.JUnitXmlReporter({
  savePath       : path.resolve(__dirname, process.env.JUNIT_RELATIVE_REPORT_PATH || '../../junit'),
  consolidateAll : false
});

jasmine.getEnv().addReporter(junitReporter);
process.on('unhandledRejection', () => {});

const resetAndSeedTables  = require('../../scripts/resetAndSeedTables');
const storeInitialSecrets = require('../../scripts/storeInitialSecrets');

// resetOtherDb = resetAndSeedTables.init('otherDb'),
const resetCoreDb = resetAndSeedTables.init('coreDb', process.env.PERSIST);

beforeAll(done => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  fs.truncate(path.resolve(__dirname, '../support/logs/log.log'), 0, () => {
    storeInitialSecrets()
      .then(done);
  });
});

beforeEach(done => {
  require.cache = {};
  resetCoreDb.reset()
  //.then(resetOtherDb.reset)
    .then(done)
    .catch(err => {
      /* istanbul ignore next */
      // eslint-disable-next-line no-console
      console.error('resetCoreDb error: ', err);

      /* istanbul ignore next */
      done();
    });
});

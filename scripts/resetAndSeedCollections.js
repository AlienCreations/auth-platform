'use strict';

const R            = require('ramda'),
      cuid         = require('cuid'),
      config       = require('config'),
      promiseUtils = require('alien-node-q-utils'),
      mongoConfig  = R.path(['db', 'mongoDb'], config);

const makeConnectionUrl = require('../server/core/services/lensMetrics/strategies/common/mongoDb/helpers/makeConnectionUrl');

const FAKE_SEED_DATA = [
  { _id : cuid(), a : 1 },
  { _id : cuid(), a : 1 },
  { _id : cuid(), a : 1 },
  { _id : cuid(), b : 2 },
  { _id : cuid(), b : 2 }
];

const init = MongoClient => collection => {
  const connectionUrl = makeConnectionUrl(mongoConfig.config);

  return new Promise((resolve, reject) => {

    MongoClient.connect(connectionUrl, (err, db) => {

      if (err) {
        reject(err);
        return;
      }

      resolve({
        reset : () => {
          return new Promise((resolve, reject) => {
            try {
              db.collection(collection).remove({}, () => {
                db.collection(collection).insertMany(FAKE_SEED_DATA, (err, res) => {
                  db && db.close && db.close();
                  promiseUtils.rejectOnErrorOrResolve({ resolve, reject }, err, res);
                });
              });
            } catch (e) {
              db && db.close && db.close();
              reject(e);
            }
          });
        }
      });
    });
  });
};

module.exports = MongoClient => ({
  init : init(MongoClient)
});

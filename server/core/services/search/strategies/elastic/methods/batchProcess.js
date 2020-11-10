'use strict';

const R            = require('ramda'),
      config       = require('config'),
      promiseUtils = require('alien-node-q-utils');

const logger = require('../../../../log/Log');

const cleanupCache = cacheUtils => keys => items => {
  return Promise.resolve(keys)
    .then(promiseUtils.mapP(cacheUtils.deleteItem, R.__))
    .then(R.always(items));
};

const batchProcess = cacheUtils => client => numItemsToProcess => {
  return cacheUtils.keys(R.path(['search', 'queueCachePrefix'], config) + '*')
    .then(R.compose(R.take(numItemsToProcess), a => a.sort()))
    .then(keys => {
      if (R.length(keys)) {
        return Promise.resolve(keys)
          .then(promiseUtils.mapP(cacheUtils.getItem, R.__))
          .then(R.map(JSON.parse))
          .then(cleanupCache(cacheUtils)(keys))
          .then(R.flatten)
          .then(R.objOf('body'))
          .then(client.bulk.bind(client))
          .then(a => {
            logger({}).info(`Processed ${numItemsToProcess} items`);
            return a;
          });
      } else {
        return Promise.resolve();
      }
    });
};

module.exports = batchProcess;

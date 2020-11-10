'use strict';

const R          = require('ramda'),
      cacheUtils = require('../../../../../utils/cache');

const createAction      = require('../helpers/createAction'),
      createCacheKey    = require('../helpers/createCacheKey'),
      createCacheExpire = require('../helpers/createCacheExpire');

/**
 * Add an action to the redis cache queue to be batch processed
 * later to add an item into Elastic.
 * @param {String} index  The index for the elastic shard
 * @param {String} type   The type for the elastic index
 * @param {*}      item   The item to be added to the search index
 * @returns {Promise}
 */
const addItem = R.curry((index, type, item) => {
  return Promise.resolve(item)
    .then(createAction('index', index, type))
    .then(R.append(item))
    .then(cacheUtils.setItem(createCacheKey(), createCacheExpire()))
    .then(R.always(item));
});

module.exports = addItem;

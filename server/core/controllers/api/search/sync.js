'use strict';

const R            = require('ramda'),
      config       = require('config'),
      promiseUtils = require('alien-node-q-utils'),
      axios        = require('axios'),
      Search       = require('../../../services/search/Search')(R.path(['search', 'strategy'], config));

const { protocol, host, port, user, password } = config.search,
      elasticUrl                               = `${protocol}://${user}:${password}@${host}:${port}`;

const getAllCloudUsers = require('../cloudUser/getAllCloudUsers');

/**
 * Delete current elastic search contents and re-seed.
 */
const sync = () => {
  let processedCount = 0;

  const _updateProcessed = arr => {
    processedCount += R.length(arr);
  };

  const omitSystemUser = R.reject(R.propEq('id', 1));

  return new Promise((resolve, reject) => {
    axios.delete(elasticUrl + '/_all')
      .then(() => Search.batchProcess(Infinity))
      .then(() => getAllCloudUsers())
      .then(omitSystemUser)

      .then(R.map(R.pick(config.api.USER_SEARCH_INDEXED_FIELDS)))
      .then(R.tap(console.log))
      .then(promiseUtils.mapP(Search.addItem('cloudusers', 'clouduser')))
      .then(_updateProcessed)

      .then(() => Search.batchProcess(Infinity))
      .then(() => processedCount + ' items processed for search')

      .then(resolve)
      .catch(reject);
  });

};

module.exports = sync;

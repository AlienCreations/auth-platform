'use strict';

const config = require('config');

const { protocol, host, port, user, password } = config.search,
      elasticUrl                               = `${protocol}://${user}:${password}@${host}:${port}`;

const search = axios => ({ type, index, field, size, from, query }) => {
  const url = elasticUrl + '/' + index + '/' + type + '/_search/?size=' + size + '&from=' + from;

  return new Promise((resolve, reject) => {
    Promise.resolve(query)
      .then(config.search.getQueryPayloadByTypeAndField[type][field])
      .then(body => {
        axios.post({ url, body })
          .then(a => a.data)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });

};

module.exports = search;

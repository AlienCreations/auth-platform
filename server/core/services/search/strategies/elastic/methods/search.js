'use strict';

const config = require('config');

const { protocol, host, port, user, password } = config.search,
      elasticUrl                               = `${protocol}://${user}:${password}@${host}:${port}`;

const search = request => ({ type, index, field, size, from, query }) => {

  const url = elasticUrl + '/' + index + '/' + type + '/_search/?size=' + size + '&from=' + from;

  return new Promise((resolve, reject) => {
    Promise.resolve(query)
      .then(config.search.getQueryPayloadByTypeAndField[type][field])
      .then(queryPayload => {
        request.post({
          url,
          json : queryPayload
        }, (err, httpResponse, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        });
      })
      .catch(reject);
  });

};

module.exports = search;

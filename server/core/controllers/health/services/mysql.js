'use strict';

const failed = report => err => [report, { status : 1, err }];

module.exports = report => {

  try {

    const DB = require('../../../utils/db');

    return new Promise(resolve => {
      DB.query(['SELECT version()', []])
        .then(() => resolve([report, { status : 0 }]))
        .catch(err => resolve(failed(report)(err.stack)));
    });

  } catch (err) {
    return Promise.resolve(failed(report)(err.stack));
  }

};

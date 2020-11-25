'use strict';

const maybeRejectOrResolveWith = value => (resolve, reject) => err => err ? reject(err) : resolve(value);

module.exports = {
  maybeRejectOrResolveWith
};

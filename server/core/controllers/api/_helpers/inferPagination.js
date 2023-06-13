'use strict';

const R = require('ramda');

const inferPagination = R.compose(
  R.map(Number),
  R.pick(['pageNum', 'pageSize']),
  R.propOr({}, 'query')
);

module.exports = inferPagination;

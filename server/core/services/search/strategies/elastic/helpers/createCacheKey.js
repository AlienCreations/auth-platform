'use strict';

const R      = require('ramda'),
      cuid   = require('cuid'),
      config = require('config');

const createCacheKey = () => R.path(['search', 'queueCachePrefix'], config) + new Date().getTime() + ':' + cuid();

module.exports = createCacheKey;

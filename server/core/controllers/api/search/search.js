'use strict';

const R      = require('ramda'),
      config = require('config'),
      Search = require('../../../services/search/Search')(R.path(['search', 'strategy'], config));

/**
 * Ping search server, and return some parsed results.
 * @param {String} type
 * @param {String} index
 * @param {Number} size
 * @param {Number} from
 * @param {String} query
 */
const search = Search.search;

module.exports = search;

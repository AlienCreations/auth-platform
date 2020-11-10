'use strict';

const R = require('ramda');

const getItem = client => k => client.read(k).then(R.path(['data', 'value']));

module.exports = getItem;

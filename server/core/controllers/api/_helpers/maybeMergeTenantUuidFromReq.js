'use strict';

const R = require('ramda');

const fromReq = R.compose(R.assoc('tenantUuid'), R.path(['tenant', 'uuid']));

module.exports = R.curry((req, data) => R.unless(R.prop('tenantUuid'), fromReq(req))(data));

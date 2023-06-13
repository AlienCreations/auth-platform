'use strict';

const R = require('ramda');

const fromReq = R.compose(R.assoc('tenantOrganizationUuid'), R.path(['tenantOrganization', 'uuid']));

module.exports = R.curry((req, data) => R.unless(R.prop('tenantOrganizationUuid'),fromReq(req))(data));

'use strict';

const R      = require('ramda'),
      config = require('config');

const getTenantOrganizationByTenantUuidAndSubdomain = require('../models/tenantOrganization/methods/getTenantOrganizationByTenantUuidAndSubdomain');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const extractSubdomainFromRequest = R.compose(
  R.ifElse(R.compose(R.equals(1), R.length), R.always(undefined), R.head),
  R.split('-'),
  R.head,
  R.split('.'),
  R.partial(R.invoker(1, 'get'), ['host'])
);

const appendTenantToReqAndJump = R.curry((req, next, tenantOrganization) => {
  req.tenantOrganization = tenantOrganization;
  next();
});

const maybeMergeTenantOrganizationWithReqFromSubdomain = (req, res, next) => {
  const tenantUuid = R.path(['tenant', 'uuid'], req);

  Promise.resolve(req)
    .then(extractSubdomainFromRequest)
    .then(R.ifElse(
      R.identity,
      getTenantOrganizationByTenantUuidAndSubdomain(tenantUuid),
      R.always({})
    ))
    .then(R.omit(COMMON_PRIVATE_FIELDS))
    .then(appendTenantToReqAndJump(req, next))
    .catch(() => {
      req.tenantOrganization = {};
      next();
    });
};

module.exports = maybeMergeTenantOrganizationWithReqFromSubdomain;

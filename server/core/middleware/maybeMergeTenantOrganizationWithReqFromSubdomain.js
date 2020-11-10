'use strict';

const R      = require('ramda'),
      config = require('config');

const getTenantOrganizationByTenantIdAndSubdomain = require('../models/tenantOrganization/methods/getTenantOrganizationByTenantIdAndSubdomain');

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

/**
 * Extracts the tenantOrganization subdomain from the hostname and looks up the
 * respective tenantOrganization from the database so it can be appended to the request object.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const maybeMergeTenantOrganizationWithReqFromSubdomain = (req, res, next) => {
  const tenantId = R.path(['tenant', 'id'], req);

  Promise.resolve(req)
    .then(extractSubdomainFromRequest)
    .then(R.ifElse(
      R.identity,
      getTenantOrganizationByTenantIdAndSubdomain(tenantId),
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

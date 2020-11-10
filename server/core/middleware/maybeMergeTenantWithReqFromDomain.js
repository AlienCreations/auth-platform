'use strict';

const R      = require('ramda'),
      config = require('config');

const getTenantByDomain = require('../models/tenant/methods/getTenantByDomain');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const extractDomainFromRequest = R.compose(
  R.ifElse(R.compose(R.equals(1), R.length), R.head, R.last),
  R.split('-'),
  R.head,
  R.split('.'),
  R.partial(R.invoker(1, 'get'), ['host'])
);

const appendTenantToReqAndJump = R.curry((req, next, tenant) => {
  req.tenant = tenant;
  next();
});

/**
 * Extracts the tenant domain from the hostname and looks up the
 * respective tenant from the database so it can be appended to the request object.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const maybeMergeTenantWithReqFromDomain = (req, res, next) => Promise.resolve(req)
  .then(extractDomainFromRequest)
  .then(getTenantByDomain)
  .then(R.omit(COMMON_PRIVATE_FIELDS))
  .then(appendTenantToReqAndJump(req, next))
  .catch(() => {
    req.tenant = {};
    next();
  });

module.exports = maybeMergeTenantWithReqFromDomain;

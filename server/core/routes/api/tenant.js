'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenant      = require('../../controllers/api/tenant/createTenant'),
      updateTenant      = require('../../controllers/api/tenant/updateTenant'),
      getAllTenants     = require('../../controllers/api/tenant/getAllTenants'),
      getTenantByDomain = require('../../controllers/api/tenant/getTenantByDomain'),
      getTenantById     = require('../../controllers/api/tenant/getTenantById');

const _getTenantById = require('../../models/tenant/methods/getTenantById');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenant
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    next,
    req.logger.child({}),
    'createTenant',
    () => createTenant(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenant/domain/lifetimefitness
router.get('/domain/:domain', (req, res, next) => {
  const domain = req.params.domain;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    next,
    req.logger.child({ domain }),
    'getTenantByDomain',
    () => getTenantByDomain(domain)
  );
});

// https://platform.aliencreations.com/api/v1/tenant/public/domain/lifetimefitness
router.get('/public/domain/:domain', (req, res, next) => {
  const domain = req.params.domain;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ domain }),
    'getTenantByDomain',
    () => getTenantByDomain(domain).then(R.pick(config.api.TENANT_PUBLIC_FIELDS))
  );
});

// https://platform.aliencreations.com/api/v1/tenant/id/666
router.put(
  '/id/:id',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantById,
    dataIdPath      : ['params', 'id'],
    dataOwnerIdPath : ['id'],
    identityPath    : ['tenant', 'id']
  }),
  (req, res, next) => {
    const id = maybeParseIntFromPath(['params', 'id'], req);

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child,
      'updateTenant',
      () => updateTenant(req.body, id)
    );
  }
);

router.get('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child,
    'getAllTenants',
    getAllTenants
  );
});

// https://platform.aliencreations.com/api/v1/tenant/id/3
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child,
    'getTenantById',
    () => getTenantById(id)
  );
});

module.exports = router;

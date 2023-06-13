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
      getTenantByUuid   = require('../../controllers/api/tenant/getTenantByUuid');

const _getTenantByUuid = require('../../models/tenant/methods/getTenantByUuid');

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
  const { domain } = req.params;

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
  const { domain } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ domain }),
    'getTenantByDomain',
    () => getTenantByDomain(domain).then(R.pick(config.api.TENANT_PUBLIC_FIELDS))
  );
});

// https://platform.aliencreations.com/api/v1/tenant/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantByUuid,
    dataIdPath      : ['params', 'uuid'],
    dataOwnerIdPath : ['uuid'],
    identityPath    : ['tenant', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.params;

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateTenant',
      () => updateTenant(req.body, uuid)
    );
  }
);

router.get('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'getAllTenants',
    getAllTenants
  );
});

// https://platform.aliencreations.com/api/v1/tenant/uuid/3
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantByUuid',
    () => getTenantByUuid(uuid)
  );
});

module.exports = router;

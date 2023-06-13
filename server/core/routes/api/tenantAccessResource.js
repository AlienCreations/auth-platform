'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessResource             = require('../../controllers/api/tenantAccessResource/createTenantAccessResource'),
      updateTenantAccessResource             = require('../../controllers/api/tenantAccessResource/updateTenantAccessResource'),
      deleteTenantAccessResource             = require('../../controllers/api/tenantAccessResource/deleteTenantAccessResource'),
      getAllowedTenantAccessResources        = require('../../controllers/api/tenantAccessResource/getAllowedTenantAccessResources'),
      getTenantAccessResourceByUuid          = require('../../controllers/api/tenantAccessResource/getTenantAccessResourceByUuid'),
      getTenantAccessResourcesByUuids        = require('../../controllers/api/tenantAccessResource/getTenantAccessResourcesByUuids'),
      getTenantAccessResourceByKey           = require('../../controllers/api/tenantAccessResource/getTenantAccessResourceByKey'),
      getTenantAccessResourcesByUriAndMethod = require('../../controllers/api/tenantAccessResource/getTenantAccessResourcesByUriAndMethod');

const _getTenantAccessResourceByUuid = require('../../models/tenantAccessResource/methods/getTenantAccessResourceByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantAccessResource
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantAccessResource',
    () => createTenantAccessResource(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantAccessResourceByUuid,
    dataIdPath      : ['params', 'uuid'],
    dataOwnerIdPath : ['tenantUuid'],
    identityPath    : ['tenant', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.params;

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateTenantAccessResource',
      () => updateTenantAccessResource(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantAccessResourceByUuid',
    () => getTenantAccessResourceByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uuids
router.post('/uuids', ensureAuthorized, (req, res, next) => {
  const { uuids } = req.body;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuids }),
    'getTenantAccessResourcesByUuids',
    () => getTenantAccessResourcesByUuids(uuids)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/key/foo
router.get('/key/:key', ensureAuthorized, (req, res, next) => {
  const key = R.path(['params', 'key'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'getTenantAccessResourceByKey',
    () => getTenantAccessResourceByKey(key)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uri/some-uri/method/POST
router.get('/uri/:uri/method/:method', ensureAuthorized, (req, res, next) => {
  const uri    = R.path(['params', 'uri'], req),
        method = R.path(['params', 'method'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uri, method }),
    'getTenantAccessResourcesByUriAndMethod',
    () => getTenantAccessResourcesByUriAndMethod(uri, method)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationUuid = R.path(['tenantOrganization', 'uuid'], req),
        tenantUuid             = R.path(['tenant', 'uuid'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationUuid, tenantUuid }),
    'getAllowedTenantAccessResources',
    () => getAllowedTenantAccessResources(tenantUuid, tenantOrganizationUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantAccessResource',
    () => deleteTenantAccessResource(uuid)
  );
});

module.exports = router;

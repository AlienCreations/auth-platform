'use strict';

const express  = require('express'),
      R        = require('ramda'),
      config   = require('config'),
      router   = express.Router(),
      atob     = require('btoa'),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createCloudUser      = require('../../controllers/api/cloudUser/createCloudUser'),
      updateCloudUser      = require('../../controllers/api/cloudUser/updateCloudUser'),
      getCloudUserByEmail  = require('../../controllers/api/cloudUser/getCloudUserByEmail'),
      getCloudUserByUuid   = require('../../controllers/api/cloudUser/getCloudUserByUuid'),
      getCloudUsersByUuids = require('../../controllers/api/cloudUser/getCloudUsersByUuids');

const _getCloudUserByUuid = require('../../models/cloudUser/methods/getCloudUserByUuid');

const ensureServiceJwt = require('../../middleware/ensureServiceJwt');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/cloudUser
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createCloudUser',
    () => createCloudUser(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser/email/foo@bar.com
router.get('/email/:email', ensureAuthorized, (req, res, next) => {
  const email = req.params.email;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ email }),
    'getCloudUserByEmail',
    () => getCloudUserByEmail(email)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getCloudUserByUuid,
    dataIdPath      : ['params', 'uuid'],
    dataOwnerIdPath : ['uuid'],
    identityPath    : ['user', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.params

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateCloudUser',
      () => updateCloudUser(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/cloudUser
router.put(
  '/',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getCloudUserByUuid,
    dataIdPath      : ['user', 'uuid'],
    dataOwnerIdPath : ['uuid'],
    identityPath    : ['user', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.user;

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateCloudUser',
      () => updateCloudUser(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/cloudUser/uuid/3
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getCloudUserByUuid',
    () => getCloudUserByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser
router.get('/', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.user;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getCloudUserByUuid',
    () => getCloudUserByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser/uuids/WyIzYWVlMjAyZC0wZTU0LTRhMGMtYTdkMi1hMGQ5OTc2YTAzNzgiLCJjZmMwM2FmYi1iZTkxLTRkZDgtYTRlZi0wOGUyNGI0ZTE1MDEiLCI3MTAxN2ZmMS03MjQxLTRlNDMtOTIxZi1kZWQ4MzZkMDMxNTEiLCJlZWEzZWIyYi1lNGYwLTQ0MTItODZhZS05NjRiZTA3MTUxNWUiXQ==
router.get('/uuids/:base64Uuids', ensureAuthorized, ensureServiceJwt, (req, res, next) => {
  const { base64Uuids } = req.params;
  const cloudUserUuids  = R.compose(JSON.parse, atob)(base64Uuids);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ base64Uuids, cloudUserUuids }),
    'getCloudUsersByUuids',
    () => getCloudUsersByUuids(cloudUserUuids)
  );
});

router.get('/check-session/:uuid', ensureAuthorized, (req, res) => {
  const status = (req.user && req.user.uuid === req.params.uuid) ? 200 : 401;
  res.status(status).send({});
});

module.exports = router;

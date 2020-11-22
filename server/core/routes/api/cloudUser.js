'use strict';

const express  = require('express'),
      R        = require('ramda'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createCloudUser     = require('../../controllers/api/cloudUser/createCloudUser'),
      updateCloudUser     = require('../../controllers/api/cloudUser/updateCloudUser'),
      getCloudUserByEmail = require('../../controllers/api/cloudUser/getCloudUserByEmail'),
      getCloudUserById    = require('../../controllers/api/cloudUser/getCloudUserById'),
      getCloudUsersByIds  = require('../../controllers/api/cloudUser/getCloudUsersByIds');

const _getCloudUserById = require('../../models/cloudUser/methods/getCloudUserById');

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

// https://platform.aliencreations.com/api/v1/cloudUser/id/666
router.put(
  '/id/:id',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getCloudUserById,
    dataIdPath      : ['params', 'id'],
    dataOwnerIdPath : ['id'],
    identityPath    : ['user', 'id']
  }),
  (req, res, next) => {
    const id = maybeParseIntFromPath(['params', 'id'], req);

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ id }),
      'updateCloudUser',
      () => updateCloudUser(req.body, id)
    );
  }
);

// https://platform.aliencreations.com/api/v1/cloudUser
router.put(
  '/',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getCloudUserById,
    dataIdPath      : ['user', 'id'],
    dataOwnerIdPath : ['id'],
    identityPath    : ['user', 'id']
  }),
  (req, res, next) => {
    const id = maybeParseIntFromPath(['user', 'id'], req);

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ id }),
      'updateCloudUser',
      () => updateCloudUser(req.body, id)
    );
  }
);
>>>>>>> Stashed changes

// https://platform.aliencreations.com/api/v1/cloudUser/id/3
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getCloudUserById',
    () => getCloudUserById(id)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser/id/3
router.get('/', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['user', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getCloudUserById',
    () => getCloudUserById(id)
  );
});

// https://platform.aliencreations.com/api/v1/cloudUser/ids/[1,2,3,4]
router.get('/ids/:ids', ensureAuthorized, ensureServiceJwt, (req, res, next) => {
  const cloudUserIds = R.compose(
    R.map(R.partialRight(parseInt, [10])),
    JSON.parse,
    R.pathOr('', ['params', 'ids'])
  )(req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ cloudUserIds }),
    'getCloudUsersByIds',
    () => getCloudUsersByIds(cloudUserIds)
  );
});

router.get('/check-session/:id', ensureAuthorized, (req, res) => {
  const status = (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) ? 200 : 401;
  res.status(status).send({});
});

module.exports = router;

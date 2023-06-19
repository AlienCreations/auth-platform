'use strict';

const express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const createAgent    = require('../../controllers/api/agent/createAgent'),
      updateAgent    = require('../../controllers/api/agent/updateAgent'),
      deleteAgent    = require('../../controllers/api/agent/deleteAgent'),
      getAgentByKey  = require('../../controllers/api/agent/getAgentByKey'),
      getAgentByUuid = require('../../controllers/api/agent/getAgentByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/agent
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createAgent',
    () => createAgent(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/agent/uuid/a9445fa7-52dd-43eb-a377-327e63475a7f
router.put('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'updateAgent',
    () => updateAgent(req.body, uuid)
  );
});

// https://platform.aliencreations.com/api/v1/agent/key/cixs563xk0000m4mrd68m0lrc
router.get('/key/:key', ensureAuthorized, (req, res, next) => {
  const { key } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'getAgentByKey',
    () => getAgentByKey(key)
  );
});

// https://platform.aliencreations.com/api/v1/agent/uuid/a9445fa7-52dd-43eb-a377-327e63475a7f
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getAgentByUuid',
    () => getAgentByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/agent/uuid/a9445fa7-52dd-43eb-a377-327e63475a7f
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteAgent',
    () => deleteAgent(uuid)
  );
});

module.exports = router;

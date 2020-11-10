'use strict';

const express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const createAgent   = require('../../controllers/api/agent/createAgent'),
      updateAgent   = require('../../controllers/api/agent/updateAgent'),
      deleteAgent   = require('../../controllers/api/agent/deleteAgent'),
      getAgentByKey = require('../../controllers/api/agent/getAgentByKey');

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

// https://platform.aliencreations.com/api/v1/agent/key/cixs563xk0000m4mrd68m0lrc
router.put('/key/:key', ensureAuthorized, (req, res, next) => {
  const key = req.params.key;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'updateAgent',
    () => updateAgent(req.body, key)
  );
});

// https://platform.aliencreations.com/api/v1/agent/key/cixs563xk0000m4mrd68m0lrc
router.get('/key/:key', ensureAuthorized, (req, res, next) => {
  const key = req.params.key;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'getAgentByKey',
    () => getAgentByKey(key)
  );
});

// https://platform.aliencreations.com/api/v1/agent/key/cixs563xk0000m4mrd68m0lrc
router.delete('/key/:key', ensureAuthorized, (req, res, next) => {
  const key = req.params.key;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'deleteAgent',
    () => deleteAgent(key)
  );
});

module.exports = router;

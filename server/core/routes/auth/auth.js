'use strict';

const express  = require('express'),
      router   = express.Router();

const loginCtrl   = require('../../controllers/auth/login'),
      refreshCtrl = require('../../controllers/auth/refresh'),
      logoutCtrl  = require('../../controllers/auth/logout');

router.post('/login',   loginCtrl);
router.post('/refresh', refreshCtrl);
router.post('/logout',  logoutCtrl);

module.exports = router;

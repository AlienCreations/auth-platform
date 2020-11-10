'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../utils/api');

const MailSvc = require('../services/mail/Mail')(R.path(['mail', 'strategy'], config));

const verifyProspectUser = require('../controllers/api/prospectUser/verifyProspectUser');

// https://platform.aliencreations.com/verify/user/JDJhJDEwJEFPN0ZyRlh1UFJUQXJieVJ2cW1BcE9EYkFBQmxLVlFMeUxhWEhuOHZPdkhRbzBwMXZwR0FL/john@gmail.com
router.get('/user/:token/:email', (req, res, next) => {
  const { token, email } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ token, email }),
    'verifyProspectUser',
    () => verifyProspectUser(MailSvc)(token, email)
  );
});

module.exports = router;

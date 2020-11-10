'use strict';

const R        = require('ramda'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

// https://platform.aliencreations.com/api/v1/public/keys/productPlatform,customerPlatform
router.get('/keys/:services?', (req, res, next) => {
  const services = R.compose(
    R.reject(R.isEmpty),
    R.split(','),
    R.pathOr('', ['params', 'services'])
  )(req);

  const maybeFilterByServices = R.when(
    () => services.length,
    R.filter(R.compose(
      R.includes(R.__, services),
      R.prop('serviceName')
    ))
  );

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ services }),
    'getServicePublicKeys',
    () => R.compose(
      maybeFilterByServices,
      R.values,
      R.mapObjIndexed((keys, serviceName) => ({
        serviceName,
        currentPublicKey  : keys[0],
        previousPublicKey : keys[1]
      })),
      JSON.parse
    )(process.env.PUBLIC_KEYS)
  );
});

module.exports = router;

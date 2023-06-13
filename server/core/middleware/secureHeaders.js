'use strict';

/**
 * Taken from here
 * @see https://medium.freecodecamp.org/secure-your-web-application-with-these-http-headers-fd66e0367628
 * @param req
 * @param res
 * @param next
 */
const secureHeaders = (req, res, next) => {
  res.set('strict-transport-security', 'max-age=3600');

  // TODO need a real report url..
  //res.set('expect-ct', 'max-age=3600, enforce, report-uri="https://ct.example.com/report"');
  res.set('x-frame-options', 'sameorigin');

  // TODO this one is more complex for env-specific, need to inject via config
  //res.set('content-security-policy', `default-src 'self'; script-src scripts.example.com; img-src *; media-src medias.example.com medias.legacy.example.com`);
  res.set('x-xss-protection', '1');
  res.set('x-content-type-options', 'nosniff');
  res.set('x-permitted-cross-domain-policies', 'none');

  res.set('x-request-id', req.get('x-request-id'));

  next();
};

module.exports = secureHeaders;

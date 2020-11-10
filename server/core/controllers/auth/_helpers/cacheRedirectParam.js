'use strict';

const DEFAULT_CACHE_EXPIRE_SECONDS = 300;

const setCacheRedirectParam = cache => ({
  username,
  redirectUrl,
  expires = DEFAULT_CACHE_EXPIRE_SECONDS
}) => {
  const lookupKey = `redirectParam:${username}`;

  return cache.setItem(lookupKey, expires, { redirectUrl });
};

const getCachedRedirectParam = cache => username => {
  const lookupKey = `redirectParam:${username}`;

  return cache.getItem(lookupKey)
    .then(JSON.parse)
    .then(({ redirectUrl }) => {
      cache.deleteItem(lookupKey);
      return redirectUrl;
    })
    .catch(() => undefined);
};

module.exports = {
  setCacheRedirectParam,
  getCachedRedirectParam
};

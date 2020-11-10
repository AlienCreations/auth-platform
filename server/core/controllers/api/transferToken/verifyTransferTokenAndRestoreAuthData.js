'use strict';

const R = require('ramda');

const { error, errors } = require('@aliencreations/node-error');

const validateTransferTokenData = require('./helpers/validateTransferTokenData').validateForVerify;

const getStoredAuthData = ({ logger, cache }) => ({ origin, transferToken }) => {
  const transferTokenLookupKey = `transferToken:${transferToken}`;
  return cache.getItem(transferTokenLookupKey)
    .then(JSON.parse)
    .then(profile => {
      cache.deleteItem(transferTokenLookupKey);
      if (!R.pathEq(['payload', 'destination'], origin)(profile)) {
        const message = `Transfer token meant for "${profile.payload.destination}" fetched by "${origin}"`;
        logger.warn(`${message} Failed safely and securely.`);
        throw error(
          errors.auth.TRANSFER_TOKEN_INVALID({
            message
          })
        );
      }
      return profile;
    })
    .catch(err => {
      if (err) {
        throw error(
          errors.auth.TRANSFER_TOKEN_INVALID({
            debug : {
              originalError : err
            }
          })
        );
      } else {
        throw error(
          errors.auth.TRANSFER_TOKEN_EXPIRED({})
        );
      }
    });
};

/**
 * Verifies a provided transfer token is valid and meant for the intended audience
 * auth session.
 * @param {Object} data
 */
const verifyTransferTokenAndRestoreAuthData = ({ logger, cache }) => data => Promise.resolve(data)
  .then(validateTransferTokenData)
  .then(() => data)
  .then(getStoredAuthData({ logger, cache }));

module.exports = verifyTransferTokenAndRestoreAuthData;

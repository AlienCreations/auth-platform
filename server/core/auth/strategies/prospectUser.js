'use strict';

const R             = require('ramda'),
      config        = require('config'),
      LocalStrategy = require('passport-local').Strategy;

const { errors } = require('@aliencreations/node-error');

const getCloudUserByStrategyRef = require('../../controllers/api/cloudUser/getCloudUserByStrategyRef'),
      getProspectUserByEmail    = require('../../models/prospectUser/methods/getProspectUserByEmail');

const CLOUD_USER_PROFILE_FIELDS = R.path(['auth', 'tokenProfileFields'], config);

const noop = () => {};

const maybeReturnProfileToPassport = (req, done, hashedPassword) => prospectUser => {
  if (hashedPassword === prospectUser.password) {

    getCloudUserByStrategyRef('prospectUser', prospectUser.id)
      .then(cloudUser => {
        done(null, {
          profile : R.compose(
            R.pick(CLOUD_USER_PROFILE_FIELDS),
            R.assoc('strategy', 'cloudUser')
          )(cloudUser)
        }, noop);
      })
      .catch(err => done(err, false, noop));

  } else {
    done(errors.auth.INVALID_CREDENTIALS(), false, () => {});
  }
};

const login = (req, email, hashedPassword, done) => Promise.resolve(email)
  .then(getProspectUserByEmail)
  .then(maybeReturnProfileToPassport(req, done, hashedPassword))
  .catch(err => {
    req.logger.error(`Login failed with prospectUser strategy for user (${email}). Caught err: ${JSON.stringify(err)}. Sent error: ${JSON.stringify(errors.auth.INVALID_CREDENTIALS())}`);
    done(errors.auth.INVALID_CREDENTIALS(), false);
  });

module.exports = new LocalStrategy({
  usernameField     : 'email',
  passwordField     : 'password',
  passReqToCallback : true
}, login);



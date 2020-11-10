'use strict';

const R             = require('ramda'),
      config        = require('config'),
      LocalStrategy = require('passport-local').Strategy;

const passwords           = require('../../utils/password');
const getCloudUserByEmail = require('../../models/cloudUser/methods/getCloudUserByEmail');

const CLOUD_USER_PROFILE_FIELDS = R.path(['auth', 'tokenProfileFields'], config);

const maybeReturnProfileToPassport = (req, done, password) => cloudUser => {
  if (passwords.passwordMatchesHash(password, cloudUser.password)) {

    const { strategy } = req.body;

    done(null, {
      profile : R.compose(
        R.mergeLeft({ strategy }),
        R.pick(CLOUD_USER_PROFILE_FIELDS)
      )(cloudUser),
      secret : cloudUser.password
    }, { strategyCallback : () => req.logger.info({ msg : 'Logged in as ' + cloudUser.email }) });

  } else {
    done(null, false);
  }
};

const login = (req, email, password, done) => Promise.resolve(R.toLower(email))
  .then(getCloudUserByEmail)
  .then(maybeReturnProfileToPassport(req, done, password))
  .catch(err => done(null, false, { strategyCallback : () => req.logger.err(err) }));

module.exports = new LocalStrategy({
  usernameField     : 'email',
  passwordField     : 'password',
  passReqToCallback : true
}, login);



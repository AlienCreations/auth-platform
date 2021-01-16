'use strict';

const R             = require('ramda'),
      config        = require('config'),
      LocalStrategy = require('passport-local').Strategy;

const passwords = require('../../utils/password');

const getCloudUserByEmail                         = require('../../models/cloudUser/methods/getCloudUserByEmail'),
      getTenantAccessRoleAssignmentsByCloudUserId = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByCloudUserId');

const CLOUD_USER_PROFILE_FIELDS = R.path(['auth', 'tokenProfileFields'], config),
      TENANCY_PROFILE_FIELDS    = ['id', 'domain', 'title', 'logo'];

const associateAssignedTenantAccessRoles = cloudUser => Promise.resolve(cloudUser)
  .then(R.prop('id'))
  .then(getTenantAccessRoleAssignmentsByCloudUserId)
  .then(R.pluck('tenantAccessRoleId'))
  .then(R.objOf('roles'))
  .then(R.mergeRight(cloudUser));

const maybeReturnProfileToPassport = (req, done, password) => cloudUser => {
  if (passwords.passwordMatchesHash(password, cloudUser.password)) {

    const { strategy } = req.body;

    done(null, {
      profile : R.compose(
        R.pick(CLOUD_USER_PROFILE_FIELDS),
        R.assoc('strategy', strategy),
        R.assoc('tenant', R.pick(TENANCY_PROFILE_FIELDS)(req.tenant)),
        R.assoc('tenantOrganization', R.pick(TENANCY_PROFILE_FIELDS)(req.tenantOrganization)),
      )(cloudUser),
      secret : cloudUser.password
    }, { strategyCallback : () => req.logger.info({ msg : 'Logged in as ' + cloudUser.email }) });

  } else {
    done(null, false);
  }
};

const login = (req, email, password, done) => Promise.resolve(R.toLower(email))
  .then(getCloudUserByEmail)
  .then(associateAssignedTenantAccessRoles)
  .then(maybeReturnProfileToPassport(req, done, password))
  .catch(err => done(null, false, { strategyCallback : () => req.logger.err(err) }));

module.exports = new LocalStrategy({
  usernameField     : 'email',
  passwordField     : 'password',
  passReqToCallback : true
}, login);



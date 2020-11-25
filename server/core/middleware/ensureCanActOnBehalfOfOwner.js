'use strict';

const R                 = require('ramda'),
      { error, errors } = require('@aliencreations/node-error');

const maybeParseIntFromPath = require('../controllers/api/_helpers/maybeParseIntFromPath');

const SUPER_ADMIN_ROLE_ID = 1;
const isSuperAdmin        = R.includes(SUPER_ADMIN_ROLE_ID);

const ensureCanActOnBehalfOfOwner = ({
  getDataById,
  dataIdPath      = ['params', 'id'],
  dataOwnerIdPath = ['body', 'tenantId'],
  identityPath    = ['tenant', 'id']
}) => (req, res, next) => {
  const id = maybeParseIntFromPath(dataIdPath)(req);

  if (R.compose(isSuperAdmin, R.pathOr([], ['user', 'roles']))(req)) {
    return next();
  }

  Promise.resolve(id)
    .then(getDataById)
    .then(data => {
      if (R.compose(
        R.apply(R.equals),
        R.reject(R.isNil),
        R.ap([R.path(dataOwnerIdPath), R.path(identityPath)])
      )([data, req])) {
        next();
      } else {
        next(error(
          errors.auth.FORBIDDEN_API_ACCESS({
            debug : {
              msg : `Owner check for data ${dataOwnerIdPath} does not match identity ${identityPath}`
            }
          })
        ));
      }
    })
    .catch(err => {
      next(err);
    });
};

module.exports = ensureCanActOnBehalfOfOwner;

'use strict';

// Dependencies
const R                                                = require('ramda'),
      path                                             = require('path'),
      config                                           = require('config'),
      bodyParser                                       = require('body-parser'),
      cookieParser                                     = require('cookie-parser'),
      apiUtils                                         = require('alien-node-api-utils'),
      passport                                         = require('./auth/passport').init(),

      // Express app
      express                                          = require('express'),
      app                                              = express(),
      logger                                           = require('./services/log/Log')({}),
      { scrubErrorForBrowser }                         = require('./utils/res'),

      // Middleware
      allowCors                                        = require('./middleware/allowCors'),
      secureHeaders                                    = require('./middleware/secureHeaders'),
      maybeMergeTenantWithReqFromDomain                = require('./middleware/maybeMergeTenantWithReqFromDomain'),
      maybeMergeTenantOrganizationWithReqFromSubdomain = require('./middleware/maybeMergeTenantOrganizationWithReqFromSubdomain'),
      maybeMergeReqHeadersWithLogger                   = require('./middleware/maybeMergeReqHeadersWithLogger'),
      addMonitorReference                              = require('./middleware/addMonitorReference'),
      compression                                      = require('compression'),
      session                                          = require('express-session'),
      redisConfig                                      = R.prop(R.__, R.prop('redis', config)),
      redis                                            = require(redisConfig('client')),
      redisClient                                      = redis.createClient(Number(redisConfig('port')), redisConfig('host'), redisConfig('options') || {}),
      RedisStore                                       = require('connect-redis')(session),

      // Routes
      ping                                             = (req, res) => res.send('pong ' + new Date().toISOString()),
      unknown                                          = (req, res) => res.status(404).json({
        data : {
          code    : 1234,
          message : 'unknown'
        }
      }),
      health                                           = require('./routes/health'),
      authRoutes                                       = require('./routes/auth/auth'),
      pageRoutes                                       = require('./routes/index'),
      cloudUserApiRoutes                               = require('./routes/api/cloudUser'),
      prospectUserApiRoutes                            = require('./routes/api/prospectUser'),
      prospectTenantApiRoutes                          = require('./routes/api/prospectTenant'),
      agentApiRoutes                                   = require('./routes/api/agent'),
      tenantApiRoutes                                  = require('./routes/api/tenant'),
      tenantConnectionApiRoutes                        = require('./routes/api/tenantConnection'),
      tenantOrganizationApiRoutes                      = require('./routes/api/tenantOrganization'),
      tenantMemberApiRoutes                            = require('./routes/api/tenantMember'),
      tenantAccessPermissionApiRoutes                  = require('./routes/api/tenantAccessPermission'),
      tenantAccessResourceApiRoutes                    = require('./routes/api/tenantAccessResource'),
      tenantAccessRoleApiRoutes                        = require('./routes/api/tenantAccessRole'),
      tenantAccessRoleAssignmentApiRoutes              = require('./routes/api/tenantAccessRoleAssignment'),
      passwordResetApiRoutes                           = require('./routes/api/passwordReset'),
      transferApiRoutes                                = require('./routes/api/transfer'),
      publicApiRoutes                                  = require('./routes/api/public'),
      verifyRoutes                                     = require('./routes/verify'),

      // Controller helpers needed for session deserialization
      getCloudUserById                                 = require('./controllers/api/cloudUser/getCloudUserById');

const { error, errors } = require('@aliencreations/node-error');

const clientGlobals = `window.APP = {
  errors : ${JSON.stringify(config.errors)},
  meta   : {}
};`;

const globals = (req, res) => res.set('Content-Type', 'application/javascript').send(clientGlobals);

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ msg : 'unhandledRejection', err : reason, promise });
});


// Because we catch all thrown controller exceptions in our middleware
const logUncaughtExceptions = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const msg = `Uncaught ${process.env.THIS_SERVICE_NAME} Exception at highest level: `;

  try {
    (req.logger) ? req.logger.error({ msg, err }) : console.log(msg, err);
    apiUtils.jsonResponseError(req, res, next, scrubErrorForBrowser(err, req));
  } catch (err) {
    (req.logger) ? req.logger.error({ msg, err }) : console.log(msg, err);
    const uncaughtErr = error(errors.system.UNCAUGHT({ debug : { originalError : err } }));
    return next(uncaughtErr);
  }
};

require('dotenv-safe').config({ allowEmptyValues : true });

// View rendering
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/views/*', (req, res) => {
  res.render(path.resolve(app.get('views'), req.params[0]));
});

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));

// Cookie parsing
app.use(cookieParser());

// Session
redisClient.auth(redisConfig('password'));
app.use(session({
  store  : new RedisStore({ client : redisClient }),
  secret : R.path(['auth', 'MASTER_SALT'], config),
  cookie : {}
}));

// Authentication
app.use(passport.initialize());

passport.serializeUser((cloudUser, done) => {
  done(null, cloudUser.id);
});

passport.deserializeUser((id, done) => Promise.resolve(id)
  .then(getCloudUserById)
  .then(R.partial(done, [null])).catch(done));

// Static assets, if any, which are not handled by Nginx
app.use(express.static('./dist'));
app.use(express.static('./tmp'));

// CORS middleware must come before routes
app.use(maybeMergeReqHeadersWithLogger);
app.use(addMonitorReference);
app.use(allowCors);
app.use(secureHeaders);
app.use(compression());

app.use(maybeMergeTenantWithReqFromDomain);
app.use(maybeMergeTenantOrganizationWithReqFromSubdomain);

// Routing
app.use('/', pageRoutes);
app.use('/ping', ping);
app.use('/health', health);
app.use('/api/v1/auth/health', health);
app.use('/globals', globals);
app.use('/auth', authRoutes);
app.use('/verify', verifyRoutes);
app.use('/password-reset', passwordResetApiRoutes);
app.use('/api/v1/auth/passwordReset', passwordResetApiRoutes);
app.use('/api/v1/auth/transfer', transferApiRoutes);
app.use('/api/v1/auth/cloudUser', cloudUserApiRoutes);
app.use('/api/v1/auth/prospectUser', prospectUserApiRoutes);
app.use('/api/v1/auth/prospectTenant', prospectTenantApiRoutes);
app.use('/api/v1/auth/agent', agentApiRoutes);
app.use('/api/v1/auth/tenant', tenantApiRoutes);
app.use('/api/v1/auth/tenantConnection', tenantConnectionApiRoutes);
app.use('/api/v1/auth/tenantOrganization', tenantOrganizationApiRoutes);
app.use('/api/v1/auth/tenantMember', tenantMemberApiRoutes);
app.use('/api/v1/auth/tenantAccessPermission', tenantAccessPermissionApiRoutes);
app.use('/api/v1/auth/tenantAccessResource', tenantAccessResourceApiRoutes);
app.use('/api/v1/auth/tenantAccessRole', tenantAccessRoleApiRoutes);
app.use('/api/v1/auth/tenantAccessRoleAssignment', tenantAccessRoleAssignmentApiRoutes);
app.use('/api/v1/auth/public', publicApiRoutes);

app.use('*', unknown);

app.use(logUncaughtExceptions);

module.exports = app;

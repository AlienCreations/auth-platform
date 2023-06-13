'use strict';

const R          = require('ramda'),
      { errors } = require('@aliencreations/node-error');

const maybeMysqlSsl = () => process.env.MYSQL_USE_SSL === 'true' ? {
  dialect : 'mysql',
  ssl     : 'Amazon RDS'
} : {};

const DEFAULT_KEEP_ALIVE = 2 * 60 * 1000; // 2 minutes in milliseconds

const makeUserSearchMapping = () => ({
  index : 'cloudusers',
  type  : 'clouduser',
  body  : {
    properties : {
      email : {
        type : 'string'
      },
      firstName : {
        type : 'string'
      },
      lastName : {
        type : 'string'
      },
      suggest : {
        type            : 'completion',
        analyzer        : 'simple',
        search_analyzer : 'simple',
        payloads        : true
      }
    }
  }
});

const makeSearchQueryPayload = () => ({
  query     : {},
  highlight : {
    tags_schema         : 'styled',
    require_field_match : false,
    fields              : {
      '*' : {
        fragment_size       : 150,
        number_of_fragments : 3,
        fragmenter          : 'simple'
      }
    }
  }
});

const makeQueryPayloadForField = field => query => R.compose(R.assoc('query', {
  prefix : {
    [field] : query
  }
}), makeSearchQueryPayload)();

const config = {
  serviceName : R.pathOr('platform', ['env', 'THIS_SERVICE_NAME'], process),
  tenancy     : {
    platformTenantUuid   : R.path(['env', 'PLATFORM_TENANT_UUID'], process),
    platformRootUserUuid : R.path(['env', 'PLATFORM_ROOT_USER_UUID'], process)
  },
  server : {
    host      : R.pathOr('localhost', ['env', 'HOST'], process),
    keepAlive : R.pathOr(DEFAULT_KEEP_ALIVE, ['env', 'KEEP_ALIVE_TIMEOUT'], process),
    https     : R.compose(R.equals('true'), R.pathOr('true', ['env', 'HTTPS']))(process),
    nodePorts : R.compose(
      R.map(R.partialRight(parseInt, [10])),
      R.split(','),
      R.concat('')
    )(R.pathOr('1337,1338,1339', ['env', 'NODE_PORTS'], process)),
    corsWhitelist : {
      patternString : process.env.CORS_WHITELIST_PATTERN,
      flags         : 'i'
    }
  },

  logger : {
    pino : {
      level : R.pathOr('debug', ['env', 'LOG_LEVEL'], process)
    }
  },

  db : {
    mysql : {
      poolConfig : password => ({
        multipleStatements : true,
        connectionLimit    : R.pathOr(30, ['env', 'CORE_DB_CONNECTION_LIMIT'], process),
        host               : R.pathOr('localhost', ['env', 'CORE_DB_HOST'], process),
        port               : R.pathOr(3306, ['env', 'CORE_DB_PORT'], process),
        user               : R.pathOr('root', ['env', 'CORE_DB_USER'], process),
        password,
        ...maybeMysqlSsl()
      }),
      searchableFields                 : {},
      DYNAMICALLY_POPULATED_DB_COLUMNS : ['timestamp']
    }
  },

  DATA_STATUS_CONSTANTS : {
    PUBLISHED       : 1,
    FLAGGED_BY_USER : 2,
    SOFT_DELETED    : 3,
    EDITED_TEXT     : 4
  },

  errors : {
    ...errors,
    decorateForJson : ({ statusCode = 501, ...err }) => ({ err, statusCode })
  },

  auth : {
    SALT_ROUNDS_EXPONENT : 10,
    MASTER_SALT          : R.pathOr('ali3ncr3ations', ['env', 'MASTER_SALT'], process),
    strategy             : 'jwt',
    jwtPayload           : {
      alg       : 'RS256',
      strategy  : 'service',
      key       : 'authPlatform',
      expiresIn : '20s'
    },
    jwtOptions : {
      algorithm : 'RS256',
      expiresIn : R.pathOr('20s', ['env', 'JWT_TTL'], process)
    },
    refreshTokenOptions : {
      expiresInSeconds : R.compose(R.partialRight(parseInt, [10]), R.pathOr(7200, ['env', 'REFRESH_TOKEN_TTL_SECONDS']))(process)
    },
    transferTokenOptions : {
      expiresInSeconds : R.compose(R.partialRight(parseInt, [10]), R.pathOr(10, ['env', 'TRANSFER_TOKEN_TTL_SECONDS']))(process)
    },
    userStrategies     : ['cloudUser', 'prospectUser'],
    tokenProfileFields : [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'portrait',
      'strategy',
      'alg',
      'roles',
      'language',
      'timezone',
      'city',
      'statusCode',
      'message',
      'requireMfa',
      'aud',
      'key',
      'ipWhitelist',
      'metaJson',
      'tenant',
      'tenantOrganization'
    ],
    requireMfaFields : [
      'id',
      'email',
      'strategy',
      'alg',
      'language',
      'timezone',
      'statusCode',
      'message',
      'requireMfa'
    ]
  },

  redis : {
    client   : 'redis',
    host     : R.pathOr('localhost', ['env', 'REDIS_HOST'], process),
    port     : R.pathOr(6379, ['env', 'REDIS_PORT'], process),
    password : R.pathOr('', ['env', 'REDIS_PASSWORD'], process),
    options  : R.mergeAll([
      /* istanbul ignore next */
      process.env.REDIS_USE_TLS === 'false' ? {} : { tls : { checkServerIdentity : () => undefined } }
    ])
  },

  api : {
    COMMON_PRIVATE_FIELDS              : [],
    TENANT_PRIVATE_FIELDS              : [],
    TENANT_PUBLIC_FIELDS               : ['id', 'domain', 'title', 'logo'],
    TENANT_ORGANIZATION_PUBLIC_FIELDS  : ['id', 'subdomain', 'title', 'logo'],
    AGENT_PRIVATE_FIELDS               : ['secret'],
    USER_PRIVATE_FIELDS                : ['password', 'secret', 'refreshToken'],
    USER_SEARCH_INDEXED_FIELDS         : ['id', 'firstName', 'lastName', 'email', 'birthday', 'portrait', 'zip'],
    TENANT_CONNECTION_PRIVATE_FIELDS   : ['password'],
    TENANT_ORGANIZATION_PRIVATE_FIELDS : ['password'],
    COMMON_SQL_RETURNABLE_PROPERTIES   : [
      'affectedRows',
      'warningCount',
      'message',
      'changedRows'
    ]
  },

  search : {
    protocol         : R.pathOr('http', ['env', 'SEARCH_PROTOCOL'], process),
    host             : R.pathOr('localhost', ['env', 'SEARCH_HOST'], process),
    port             : R.pathOr(9200, ['env', 'SEARCH_PORT'], process),
    user             : R.pathOr('elastic', ['env', 'SEARCH_USER'], process),
    password         : R.pathOr('', ['env', 'SEARCH_PASSWORD'], process),
    perPage          : 50,
    strategy         : 'elastic',
    queueCachePrefix : 'elastic.queue.action:',
    mappings         : [
      makeUserSearchMapping()
    ],
    getQueryPayloadByTypeAndField : {
      clouduser : {
        email     : makeQueryPayloadForField('email'),
        firstName : makeQueryPayloadForField('firstName'),
        lastName  : makeQueryPayloadForField('lastName')
      }
    }
  },

  secret : {
    strategy : R.pathOr('vault', ['env', 'SECRET_STRATEGY'], process),
    vault    : {
      host       : R.path(['env', 'VAULT_HOST'], process),
      port       : R.path(['env', 'VAULT_HOST'], process),
      token      : R.path(['env', 'VAULT_TOKEN'], process),
      endpoint   : R.path(['env', 'VAULT_ENDPOINT'], process),
      apiVersion : R.path(['env', 'VAULT_API_VERSION'], process)
    }
  },

  mail : {
    strategy : R.pathOr('mandrill', ['env', 'MAIL_STRATEGY'], process),
    platform : {
      from : {
        email : 'support@aliencreations.com',
        name  : 'Alien Creations'
      }
    },
    mandrill : {
      host   : R.pathOr('localhost', ['env', 'MAIL_HOST'], process),
      port   : R.pathOr(22, ['env', 'MAIL_PORT'], process),
      apiKey : R.pathOr('', ['env', 'MAIL_API_KEY'], process)
    }
  },

  monitor : {
    strategy : R.pathOr('local', ['env', 'MONITOR_STRATEGY'], process)
  }

};

module.exports = config;

// eslint-disable-next-line no-console
console.log('USING DEFAULT CONFIG');

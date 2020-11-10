'use strict';

const maybeMysqlSsl = process.env.MYSQL_USE_SSL === 'true' ? {
  dialect : 'mysql',
  ssl     : 'Amazon RDS'
} : {};

const config = {

  db : {
    mysql : {
      poolConfig : password => ({
        connectionLimit    : 10,
        host               : process.env.CORE_DB_HOST,
        user               : process.env.CORE_DB_USER,
        password,
        port               : process.env.CORE_DB_PORT,
        multipleStatements : true,
        ...maybeMysqlSsl
      })
    }
  },

  mail : {
    strategy : 'local',
    platform : {
      from : {
        email : 'support@aliencreations.test',
        name  : 'Alien Creations'
      }
    },
    local : {
      port      : process.env.SMTP_MAIL_PORT,
      ignoreTLS : true,
      secure    : false
    }
  }

};

module.exports = config;

// eslint-disable-next-line no-console
console.log('USING DEMO CONFIG');

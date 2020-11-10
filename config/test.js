'use strict';

const config = {
  server : {
    corsWhitelist : {
      patternString : 'localhost',
      flags         : 'i'
    }
  },

  db : {
    mysql : {
      poolConfig : () => ({
        connectionLimit    : 10,
        host               : process.env.CORE_DB_HOST,
        user               : process.env.CORE_DB_USER,
        password           : process.env.CORE_DB_PASSWORD,
        port               : process.env.CORE_DB_PORT,
        multipleStatements : true
      })
    }
  },

  redis : {
    client   : 'redistub',
    host     : process.env.REDIS_HOST,
    port     : process.env.REDIS_PORT,
    password : process.env.REDIS_PASSWORD
  }

};

module.exports = config;

// eslint-disable-next-line no-console
console.log('USING TEST CONFIG');

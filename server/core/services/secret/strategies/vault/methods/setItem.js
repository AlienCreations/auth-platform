'use strict';

const setItem = client => (k, v) => client.write(k, { data : v });

module.exports = setItem;

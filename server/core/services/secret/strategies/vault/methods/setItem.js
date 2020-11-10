'use strict';

const setItem = client => (k, v) => client.write(k, { value : v });

module.exports = setItem;

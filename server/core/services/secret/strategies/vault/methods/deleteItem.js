'use strict';

const deleteItem = client => k => client.delete(k);

module.exports = deleteItem;

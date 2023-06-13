'use strict';

module.exports = {
  createAgent    : require('./methods/createAgent'),
  deleteAgent    : require('./methods/deleteAgent'),
  getAgentById   : require('./methods/getAgentById'),
  getAgentByKey  : require('./methods/getAgentByKey'),
  getAgentByUuid : require('./methods/getAgentByUuid'),
  updateAgent    : require('./methods/updateAgent')
};

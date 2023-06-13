'use strict';

module.exports = {
  createProspectUser     : require('./methods/createProspectUser'),
  getProspectUserByEmail : require('./methods/getProspectUserByEmail'),
  getProspectUserById    : require('./methods/getProspectUserById'),
  getProspectUserByUuid  : require('./methods/getProspectUserByUuid'),
  updateProspectUser     : require('./methods/updateProspectUser')
};

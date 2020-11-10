'use strict';

module.exports = {
  createCloudUser     : require('./methods/createCloudUser'),
  getAllCloudUsers    : require('./methods/getAllCloudUsers'),
  getCloudUserByEmail : require('./methods/getCloudUserByEmail'),
  getCloudUserById    : require('./methods/getCloudUserById'),
  getCloudUsersByIds  : require('./methods/getCloudUsersByIds'),
  searchCloudUsers    : require('./methods/searchCloudUsers'),
  updateCloudUser     : require('./methods/updateCloudUser')
};

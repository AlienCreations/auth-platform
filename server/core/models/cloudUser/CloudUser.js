'use strict';

module.exports = {
  createCloudUser      : require('./methods/createCloudUser'),
  getAllCloudUsers     : require('./methods/getAllCloudUsers'),
  getCloudUserByEmail  : require('./methods/getCloudUserByEmail'),
  getCloudUserById     : require('./methods/getCloudUserById'),
  getCloudUsersByIds   : require('./methods/getCloudUsersByIds'),
  getCloudUserByUuid   : require('./methods/getCloudUserByUuid'),
  getCloudUsersByUuids : require('./methods/getCloudUsersByUuids'),
  searchCloudUsers     : require('./methods/searchCloudUsers'),
  updateCloudUser      : require('./methods/updateCloudUser')
};

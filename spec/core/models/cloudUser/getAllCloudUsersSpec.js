'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllCloudUsers = require('../../../../server/core/models/cloudUser/methods/getAllCloudUsers');

let KNOWN_TEST_CLOUD_USERS_COUNT;

describe('getAllCloudUsers', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USERS_COUNT = R.length(data);
      done();
    });
  });

  it('gets all cloudUsers', done => {
    getAllCloudUsers().then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length).toBe(KNOWN_TEST_CLOUD_USERS_COUNT);
      done();
    });
  });
});

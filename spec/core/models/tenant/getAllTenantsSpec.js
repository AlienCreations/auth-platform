'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllTenants = require('../../../../server/core/models/tenant/methods/getAllTenants');

let KNOWN_TEST_TENANTS_COUNT;

describe('getAllTenants', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANTS_COUNT = R.length(data);
      done();
    });
  });

  it('gets all tenants', done => {
    getAllTenants().then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length).toBe(KNOWN_TEST_TENANTS_COUNT);
      done();
    });
  });
});

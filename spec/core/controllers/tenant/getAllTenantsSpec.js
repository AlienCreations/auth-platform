'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllTenants = require('../../../../server/core/controllers/api/tenant/getAllTenants');

let KNOWN_TEST_TENANTS;

describe('tenantCtrl.getAllTenants', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANTS = R.sortBy(R.prop('domain'), commonMocks.transformDbColsToJsProps(data));
      done();
    });
  });

  it('returns all tenants', done => {
    getAllTenants()
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANTS);
        done();
      })
      .catch(done.fail);
  });

});

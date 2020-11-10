'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/deleteTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'asd';

let KNOWN_TEST_ID;

describe('deleteTenantAccessPermission', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantAccessPermission record when given a known tenantAccessPermission id', done => {
    deleteTenantAccessPermission(KNOWN_TEST_ID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantAccessPermission id', done => {
    deleteTenantAccessPermission(FAKE_UNKNOWN_ID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantAccessPermission();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      deleteTenantAccessPermission(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});

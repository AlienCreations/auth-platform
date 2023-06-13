'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionById = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionById'),
      commonMocks                   = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'xxx';

let KNOWN_TEST_ID;

describe('getTenantAccessPermissionById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessPermission when given a known id', done => {
    getTenantAccessPermissionById(KNOWN_TEST_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown id', done => {
    getTenantAccessPermissionById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      getTenantAccessPermissionById(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getTenantAccessPermissionById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getTenantAccessPermissionById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

});

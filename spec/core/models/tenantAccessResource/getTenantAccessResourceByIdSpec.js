'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourceById = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourceById'),
      commonMocks                 = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'xxx';

let KNOWN_TEST_ID;

describe('getTenantAccessResourceById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessResource when given a known id', done => {
    getTenantAccessResourceById(KNOWN_TEST_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown id', done => {
    getTenantAccessResourceById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      getTenantAccessResourceById(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getTenantAccessResourceById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getTenantAccessResourceById(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});

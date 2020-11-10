'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourceByKey = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourceByKey'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_KEY   = 'foo',
      FAKE_MALFORMED_KEY = 1234;

let KNOWN_TEST_KEY;

describe('getTenantAccessResourceByKey', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_KEY = R.compose(R.prop('key'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessResource when given a known key', done => {
    getTenantAccessResourceByKey(KNOWN_TEST_KEY).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown key', done => {
    getTenantAccessResourceByKey(FAKE_UNKNOWN_KEY)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed key', () => {
    expect(() => {
      getTenantAccessResourceByKey(FAKE_MALFORMED_KEY);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when key is missing', () => {
    expect(() => {
      getTenantAccessResourceByKey();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when key is set to null', () => {
    expect(() => {
      getTenantAccessResourceByKey(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});

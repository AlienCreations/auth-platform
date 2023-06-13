'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourceByUuid = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourceByUuid'),
      commonMocks                   = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'foo'

let KNOWN_TEST_UUID;

describe('getTenantAccessResourceByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessResource when given a known uuid', done => {
    getTenantAccessResourceByUuid(KNOWN_TEST_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown uuid', done => {
    getTenantAccessResourceByUuid(FAKE_UNKNOWN_UUID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getTenantAccessResourceByUuid(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuid is missing', () => {
    expect(() => {
      getTenantAccessResourceByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuid is set to null', () => {
    expect(() => {
      getTenantAccessResourceByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

});

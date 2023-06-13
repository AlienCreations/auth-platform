'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourcesByUriAndMethod = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourcesByUriAndMethod'),
      commonMocks                            = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_URI        = 'foo',
      FAKE_UNSUPPORTED_METHOD = 'foo',
      FAKE_MALFORMED_URI      = 1234;

let KNOWN_TEST_URI,
    KNOWN_TEST_METHOD;

describe('getTenantAccessResourcesByUriAndMethod', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_URI    = data[0].uri;
      KNOWN_TEST_METHOD = data[0].method;
      done();
    });
  });

  it('gets a tenantAccessResource when given a known uri and method', done => {
    getTenantAccessResourcesByUriAndMethod(KNOWN_TEST_URI, KNOWN_TEST_METHOD)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('returns only the wildcards when given an unknown uri', done => {
    getTenantAccessResourcesByUriAndMethod(FAKE_UNKNOWN_URI, KNOWN_TEST_METHOD)
      .then(data => {
        expect(data.length).toBe(1);
        expect(data[0].uri).toBe('*');
        expect(data[0].method).toBe('*');
        done();
      });
  });

  it('throws an error when given an unsupported method', () => {
    expect(() => {
      getTenantAccessResourcesByUriAndMethod(KNOWN_TEST_URI, FAKE_UNSUPPORTED_METHOD);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed uri', () => {
    expect(() => {
      getTenantAccessResourcesByUriAndMethod(FAKE_MALFORMED_URI, KNOWN_TEST_METHOD);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when params are missing', () => {
    expect(() => {
      getTenantAccessResourcesByUriAndMethod();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

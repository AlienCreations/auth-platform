'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourcesByUriAndMethod = require('../../../../server/core/controllers/api/tenantAccessResource/getTenantAccessResourcesByUriAndMethod');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_URI   = 'foo',
      FAKE_UNSUPPORTED_METHOD                   = 'foo',
      FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_URI = 1234;

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_METHOD;

describe('tenantAccessResourceCtrl.getTenantAccessResourcesByUriAndMethod', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA   = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI    = KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.uri;
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_METHOD = KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.method;
      done();
    });
  });

  it('returns tenantAccessResourceData when looking for an tenantAccessResource by uri and method', done => {
    getTenantAccessResourcesByUriAndMethod(KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI, KNOWN_TEST_TENANT_ACCESS_RESOURCE_METHOD)
      .then(res => {
        expect(res[0].id).toEqual(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.id);
        done();
      })
      .catch(done.fail);
  });

  it('returns only wildcards when looking for an tenantAccessResource that does not exist', done => {
    getTenantAccessResourcesByUriAndMethod(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_URI, KNOWN_TEST_TENANT_ACCESS_RESOURCE_METHOD)
      .then(res => {
        expect(res.length).toBe(1);
        expect(res[0].uri).toEqual('*');
        expect(res[0].method).toEqual('*');
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uri', done => {
    getTenantAccessResourcesByUriAndMethod(FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_URI, KNOWN_TEST_TENANT_ACCESS_RESOURCE_METHOD)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given an unsupported method', done => {
    getTenantAccessResourcesByUriAndMethod(KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI, FAKE_UNSUPPORTED_METHOD)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessResource without params', done => {
    getTenantAccessResourcesByUriAndMethod()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

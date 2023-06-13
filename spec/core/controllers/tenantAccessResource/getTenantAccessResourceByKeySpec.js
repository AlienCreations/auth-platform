'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourceByKey = require('../../../../server/core/controllers/api/tenantAccessResource/getTenantAccessResourceByKey');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_KEY   = 'foo',
      FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_KEY = 1234;

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY;

describe('tenantAccessResourceCtrl.getTenantAccessResourceByKey', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY  = KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.key;
      done();
    });
  });

  it('returns tenantAccessResourceData when looking for an tenantAccessResource by key', done => {
    getTenantAccessResourceByKey(KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY)
      .then(res => {
        expect(res.uri)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.uri);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessResource that does not exist', done => {
    getTenantAccessResourceByKey(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed key', done => {
    getTenantAccessResourceByKey(FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessResource without an key', done => {
    getTenantAccessResourceByKey()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessResourceByKey(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessResourceById = require('../../../../server/core/controllers/api/tenantAccessResource/getTenantAccessResourceById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID   = 9999,
      FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID;

describe('tenantAccessResourceCtrl.getTenantAccessResourceById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID   = R.prop('id', KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);
      done();
    });
  });

  it('returns tenantAccessResourceData when looking for an tenantAccessResource by id', done => {
    getTenantAccessResourceById(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .then(res => {
        expect(res.key)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.key);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessResource that does not exist', done => {
    getTenantAccessResourceById(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantAccessResourceById(FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessResource without an id', done => {
    getTenantAccessResourceById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessResourceById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

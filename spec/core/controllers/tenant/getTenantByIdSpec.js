'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantById = require('../../../../server/core/controllers/api/tenant/getTenantById');

const FAKE_UNKNOWN_TENANT_ID   = 999,
      FAKE_MALFORMED_TENANT_ID = 'foo';

let KNOWN_TEST_TENANT_DATA,
    KNOWN_TEST_TENANT_ID;

describe('tenantCtrl.getTenantById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_DATA = R.compose(R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ID   = R.prop('id', KNOWN_TEST_TENANT_DATA);
      done();
    });
  });

  it('returns tenantData when looking for a tenant by id', done => {
    getTenantById(KNOWN_TEST_TENANT_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a tenant that does not exist', done => {
    getTenantById(FAKE_UNKNOWN_TENANT_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantById(FAKE_MALFORMED_TENANT_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenant without an id', done => {
    getTenantById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

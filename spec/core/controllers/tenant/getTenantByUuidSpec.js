'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantByUuid = require('../../../../server/core/controllers/api/tenant/getTenantByUuid');

const FAKE_UNKNOWN_TENANT_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_UUID = 'foo';

let KNOWN_TEST_TENANT_DATA,
    KNOWN_TEST_TENANT_UUID;

describe('tenantCtrl.getTenantByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_DATA = R.compose(R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_UUID = KNOWN_TEST_TENANT_DATA.uuid;
      done();
    });
  });

  it('returns tenantData when looking for a tenant by uuid', done => {
    getTenantByUuid(KNOWN_TEST_TENANT_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a tenant that does not exist', done => {
    getTenantByUuid(FAKE_UNKNOWN_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getTenantByUuid(FAKE_MALFORMED_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenant without an uuid', done => {
    getTenantByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

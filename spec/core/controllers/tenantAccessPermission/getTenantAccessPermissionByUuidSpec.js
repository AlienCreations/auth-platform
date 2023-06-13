'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionByUuid = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ACCESS_PERMISSION_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID = R.prop('uuid', KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA);
      done();
    });
  });

  it('returns tenantAccessPermissionData when looking for an tenantAccessPermission by uuid', done => {
    getTenantAccessPermissionByUuid(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
      .then(res => {
        expect(res.tenantAccessResourceUuid)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA.tenantAccessResourceUuid);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessPermission that does not exist', done => {
    getTenantAccessPermissionByUuid(FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getTenantAccessPermissionByUuid(FAKE_MALFORMED_TENANT_ACCESS_PERMISSION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessPermission without an uuid', done => {
    getTenantAccessPermissionByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

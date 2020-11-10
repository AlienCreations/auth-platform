'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionById = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_ID   = 9999,
      FAKE_MALFORMED_TENANT_ACCESS_PERMISSION_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_ID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_ID   = R.prop('id', KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA);
      done();
    });
  });

  it('returns tenantAccessPermissionData when looking for an tenantAccessPermission by id', done => {
    getTenantAccessPermissionById(KNOWN_TEST_TENANT_ACCESS_PERMISSION_ID)
      .then(res => {
        expect(res.tenantAccessResourceId)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA.tenantAccessResourceId);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessPermission that does not exist', done => {
    getTenantAccessPermissionById(FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantAccessPermissionById(FAKE_MALFORMED_TENANT_ACCESS_PERMISSION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessPermission without an id', done => {
    getTenantAccessPermissionById()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionById(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

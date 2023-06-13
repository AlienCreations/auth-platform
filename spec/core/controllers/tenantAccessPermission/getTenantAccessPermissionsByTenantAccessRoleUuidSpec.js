'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessRoleUuid = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessRoleUuid');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantAccessRoleUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, _data) => {
      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID       = R.compose(R.prop('tenantAccessRoleUuid'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(R.propEq(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, 'tenantAccessRoleUuid'), data);

      done();
    });
  });

  it('returns permissionData when looking for permissions by tenantAccessRoleUuid', done => {
    getTenantAccessPermissionsByTenantAccessRoleUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for permissions for a role that does not exist', done => {
    getTenantAccessPermissionsByTenantAccessRoleUuid(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantAccessRoleUuid', done => {
    getTenantAccessPermissionsByTenantAccessRoleUuid(FAKE_MALFORMED_TENANT_ACCESS_ROLE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantAccessRoleUuid', done => {
    getTenantAccessPermissionsByTenantAccessRoleUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantAccessRoleUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

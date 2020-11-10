'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessRoleId = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessRoleId');

// TODO Currently no private fields - this should be implemented anyway.
const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID   = 999,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantAccessRoleId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_ID         = R.compose(R.prop('tenantAccessRoleId'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(R.propEq('tenantAccessRoleId', KNOWN_TEST_TENANT_ACCESS_ROLE_ID), data);

      done();
    });
  });

  it('returns permissionData when looking for permissions by tenantAccessRoleId', done => {
    getTenantAccessPermissionsByTenantAccessRoleId(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for permissions for a role that does not exist', done => {
    getTenantAccessPermissionsByTenantAccessRoleId(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantAccessRoleId', done => {
    getTenantAccessPermissionsByTenantAccessRoleId(FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantAccessRoleId', done => {
    getTenantAccessPermissionsByTenantAccessRoleId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantAccessRoleId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

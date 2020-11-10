'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessResourceId = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessResourceId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID   = 999,
      FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantAccessResourceId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID     = R.compose(R.prop('tenantAccessResourceId'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(R.propEq('tenantAccessResourceId', KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID), data);

      done();
    });
  });

  it('returns permissionData when looking for permissions by tenantAccessResourceId', done => {
    getTenantAccessPermissionsByTenantAccessResourceId(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for permissions for a resource that does not exist', done => {
    getTenantAccessPermissionsByTenantAccessResourceId(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantAccessResourceId', done => {
    getTenantAccessPermissionsByTenantAccessResourceId(FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantAccessResourceId', done => {
    getTenantAccessPermissionsByTenantAccessResourceId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantAccessResourceId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

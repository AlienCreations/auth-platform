'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessResourceUuid = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessResourceUuid');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceUuid')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantAccessResourceUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, _data) => {
      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID   = R.compose(R.prop('tenantAccessResourceUuid'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(R.propEq(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID, 'tenantAccessResourceUuid'), data);

      done();
    });
  });

  it('returns permissionData when looking for permissions by tenantAccessResourceUuid', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(res => {
        const refUuids = R.pluck('id');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for permissions for a resource that does not exist', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantAccessResourceUuid', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid(FAKE_MALFORMED_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantAccessResourceUuid', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

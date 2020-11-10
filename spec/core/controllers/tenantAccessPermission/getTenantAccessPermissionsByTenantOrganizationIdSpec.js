'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantOrganizationId = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantOrganizationId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID                        = 2,
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_IDS_FOR_MAPPED_ORGANIZATION = [4, 5, 6, 7],
      FAKE_UNKNOWN_TENANT_ORGANIZATION_ID                             = 999,
      FAKE_MALFORMED_TENANT_ORGANIZATION_ID                           = 'foo';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantOrganizationId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(R.compose(R.contains(R.__, KNOWN_TEST_TENANT_ACCESS_PERMISSION_IDS_FOR_MAPPED_ORGANIZATION), R.prop('id')), data);

      done();
    });
  });

  it('returns permissionData when looking for permissions by tenantOrganizationId', done => {
    getTenantAccessPermissionsByTenantOrganizationId(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for permissions for a organization that does not exist', done => {
    getTenantAccessPermissionsByTenantOrganizationId(FAKE_UNKNOWN_TENANT_ORGANIZATION_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantOrganizationId', done => {
    getTenantAccessPermissionsByTenantOrganizationId(FAKE_MALFORMED_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantOrganizationId', done => {
    getTenantAccessPermissionsByTenantOrganizationId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantOrganizationId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

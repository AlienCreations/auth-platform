'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessPermission = require('../../../../server/core/controllers/api/tenantAccessPermission/createTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const KNOWN_TEST_TENANT_ACCESS_ROLE_ID              = 1,
      KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_ID = 4,
      FAKE_TENANT_ACCESS_PERMISSION_DATA            = {
        tenantAccessRoleId     : KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
        tenantAccessResourceId : KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_ID,
        status                 : 1
      },
      FAKE_TENANT_ACCESS_PERMISSION_DATA_INCOMPLETE = R.omit(['tenantAccessRoleId'], FAKE_TENANT_ACCESS_PERMISSION_DATA);

let FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID,
    mergeInsertId;

describe('tenantAccessPermissionCtrl.createTenantAccessPermission', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {

      FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_PERMISSION_DATA),
        R.objOf('tenantAccessResourceId'),
        R.prop('tenant_access_resource_id'),
        R.head
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));
      done();
    });
  });

  it('returns FAKE_TENANT_ACCESS_PERMISSION_DATA when creating an tenantAccessPermission with all correct params', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_PERMISSION_DATA)));
        done();
      });
  });

  it('throws an error when creating an tenantAccessPermission with incomplete params', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessPermission (tenantAccessResourceId should be unique per tenantAccessRole)', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

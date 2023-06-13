'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessPermission = require('../../../../server/core/controllers/api/tenantAccessPermission/updateTenantAccessPermission');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_ACCESS_PERMISSION_UPDATE_DATA  = {
        status : 2
      },
      FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID,
    updatedTenantAccessPermissionData;

describe('tenantAccessPermissionCtrl.updateTenantAccessPermission', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {

      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID = KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA.uuid;

      updatedTenantAccessPermissionData = R.omit(
        COMMON_PRIVATE_FIELDS,
        R.mergeDeepRight(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA, FAKE_TENANT_ACCESS_PERMISSION_UPDATE_DATA)
      );

      done();
    });
  });

  it('updates an tenantAccessPermission when provided an id and new properties to update', done => {
    updateTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_UPDATE_DATA, KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
      .then(res => {
        expect(res.status)
          .toEqual(updatedTenantAccessPermissionData.status);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an tenantAccessPermission that does not exist', done => {
    updateTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an unsupported property (only status is allowed at this time)', done => {
    updateTenantAccessPermission({ foo : 'bar' }, KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });
});

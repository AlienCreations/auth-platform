'use strict';

const R                                = require('ramda'),
      path                             = require('path'),
      config                           = require('config'),
      CSVConverter                     = require('csvtojson').Converter,
      tenantAccessPermissionsConverter = new CSVConverter({}),
      tenantAccessRolesConverter       = new CSVConverter({}),
      tenantAccessResourcesConverter   = new CSVConverter({});

const createTenantAccessPermission = require('../../../../server/core/controllers/api/tenantAccessPermission/createTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

let FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID,
    mergeInsertId;

let KNOWN_TEST_TENANT_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID_UNMAPPED,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    FAKE_TENANT_ACCESS_PERMISSION_DATA,
    FAKE_TENANT_ACCESS_PERMISSION_DATA_INCOMPLETE;

describe('tenantAccessPermissionCtrl.createTenantAccessPermission', () => {
  beforeAll(done => {
    tenantAccessRolesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_DATA = R.compose(R.head, commonMocks.ensureTrueNullInCsvData, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = KNOWN_TEST_TENANT_ACCESS_ROLE_DATA.uuid;

      tenantAccessResourcesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
        KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA          = R.compose(commonMocks.ensureTrueNullInCsvData, commonMocks.transformDbColsToJsProps)(data);
        KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID_UNMAPPED = R.compose(R.prop('uuid'), R.last)(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);

        tenantAccessPermissionsConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
          KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.compose(R.head, commonMocks.ensureTrueNullInCsvData, commonMocks.transformDbColsToJsProps)(data);

          FAKE_TENANT_ACCESS_PERMISSION_DATA = {
            tenantAccessRoleUuid     : KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
            tenantAccessResourceUuid : KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID_UNMAPPED,
            status                   : 1
          };

          FAKE_TENANT_ACCESS_PERMISSION_DATA_INCOMPLETE = R.omit(['tenantAccessRoleUuid'], FAKE_TENANT_ACCESS_PERMISSION_DATA);

          FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID = R.compose(
            R.mergeDeepRight(FAKE_TENANT_ACCESS_PERMISSION_DATA),
            R.objOf('tenantAccessResourceUuid'),
            R.prop('tenantAccessResourceUuid')
          )(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA);

          mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));
          done();
        });
      });
    });
  });

  it('returns FAKE_TENANT_ACCESS_PERMISSION_DATA when creating an tenantAccessPermission with all correct params', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_PERMISSION_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating an tenantAccessPermission with incomplete params', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessPermission (tenantAccessResourceUuid should be unique per tenantAccessRole)', done => {
    createTenantAccessPermission(FAKE_TENANT_ACCESS_PERMISSION_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

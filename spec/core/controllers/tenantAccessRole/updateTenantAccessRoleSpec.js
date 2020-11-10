'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRole = require('../../../../server/core/controllers/api/tenantAccessRole/updateTenantAccessRole');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA = {
        title : 'faketitle'
      },
      FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID  = 9999;

let KNOWN_TEST_TENANT_ACCESS_ROLE_DATA,
    FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA_EXISTING_TITLE,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
    updatedTenantAccessRoleData;

describe('tenantAccessRoleCtrl.updateTenantAccessRole', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {

      data = commonMocks.ensureTrueNullInCsvData(data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_DATA                 = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID                   = KNOWN_TEST_TENANT_ACCESS_ROLE_DATA.id;
      FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA_EXISTING_TITLE = R.compose(R.omit(['id']), R.omit(COMMON_PRIVATE_FIELDS), R.last, commonMocks.transformDbColsToJsProps)(data);

      updatedTenantAccessRoleData = R.omit(COMMON_PRIVATE_FIELDS, R.mergeDeepRight(KNOWN_TEST_TENANT_ACCESS_ROLE_DATA, FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenantAccessRole when provided an id and new properties to update', done => {
    updateTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA, KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        expect(res.title).toEqual(updatedTenantAccessRoleData.title);
        done();
      });
  });

  it('throws an error when updating an tenantAccessRole that does not exist', done => {
    updateTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing title for a mapped tenant', done => {
    updateTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_UPDATE_DATA_EXISTING_TITLE, KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

});

'use strict';

const R             = require('ramda'),
      path          = require('path'),
      CSVConverter  = require('csvtojson').Converter,
      demoConverter = new CSVConverter({}),
      prodConverter = new CSVConverter({});

const commonMocks = require('../../../_helpers/commonMocks');

let DEMO_PERMISSIONS,
    PROD_PERMISSIONS;

describe('ensureTenantAccessPermissionsSeedDataIntegrity', () => {
  beforeAll(done => {
    demoConverter.fromFile(path.resolve(__dirname, '../../../../run/env/demo/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      DEMO_PERMISSIONS = R.map(commonMocks.ensureTrueNullInCsvData, data);
      prodConverter.fromFile(path.resolve(__dirname, '../../../../run/env/production/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
        PROD_PERMISSIONS = R.map(commonMocks.ensureTrueNullInCsvData, data);
        done();
      });
    });
  });

  const assertSequential = data => data.map(({ id }, i) => { expect(id).toBe(i + 1); });

  const assertUnique = data => {
    const count = data => data.reduce((a, b) => ({ ...a, [b] : (a[b] || 0) + 1 }), {});
    const duplicates = dict => Object.keys(dict).filter(a => dict[a] > 1);

    expect(
      duplicates(
        count(
          R.map(({ tenant_access_role_uuid, tenant_access_resource_uuid }) => `${tenant_access_role_uuid}:${tenant_access_resource_uuid}`)(data)
        )
      )
    ).toEqual([]);
  };

  describe('demo', () => {
    it('has a sequential data set', () => {
      assertSequential(DEMO_PERMISSIONS);
    });

    it('has unique assignments', () => {
      assertUnique(DEMO_PERMISSIONS);
    });
  });

  describe('prod', () => {
    it('has a sequential data set', () => {
      assertSequential(PROD_PERMISSIONS);
    });

    it('has unique assignments', () => {
      assertUnique(PROD_PERMISSIONS);
    });
  });
});

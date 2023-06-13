'use strict';

const R             = require('ramda'),
      path          = require('path'),
      CSVConverter  = require('csvtojson').Converter,
      demoConverter = new CSVConverter({}),
      prodConverter = new CSVConverter({});

const commonMocks = require('../../../_helpers/commonMocks');

let DEMO_RESOURCES,
    PROD_RESOURCES;

describe('ensureTenantAccessResourcesSeedDataIntegrity', () => {
  beforeAll(done => {
    demoConverter.fromFile(path.resolve(__dirname, '../../../../run/env/demo/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      DEMO_RESOURCES = R.map(commonMocks.ensureTrueNullInCsvData, data);
      prodConverter.fromFile(path.resolve(__dirname, '../../../../run/env/production/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
        PROD_RESOURCES = R.map(commonMocks.ensureTrueNullInCsvData, data);
        done();
      });
    });
  });

  const assertSequential = data => data.map(({ id }, i) => { expect(id).toBe(i + 1); });

  const assertUnique = data => {
    const count = data => data.reduce((a, b) => ({ ...a, [b] : (a[b] || 0) + 1 }), {});
    const duplicates = dict => Object.keys(dict).filter(a => dict[a] > 1);

    expect(duplicates(count(R.pluck('key')(data)))).toEqual([]);
  };

  describe('demo', () => {
    it('has a sequential data set', () => {
      assertSequential(DEMO_RESOURCES);
    });

    it('has unique keys', () => {
      assertUnique(DEMO_RESOURCES);
    });
  });

  describe('prod', () => {
    it('has a sequential data set', () => {
      assertSequential(PROD_RESOURCES);
    });

    it('has unique keys', () => {
      assertUnique(PROD_RESOURCES);
    });
  });
});

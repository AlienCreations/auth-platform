'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationsByTenantUuid = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationsByTenantUuid'),
      commonMocks                        = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_UUID;

describe('getTenantOrganizationsByTenantUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_UUID = R.compose(R.prop('tenantUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantOrganizations when given a valid tenantUuid', done => {
    getTenantOrganizationsByTenantUuid(KNOWN_TEST_TENANT_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_TENANT_UUID)),
            R.pluck('tenantUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      getTenantOrganizationsByTenantUuid('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantOrganizationsByTenantUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantUuid', () => {
    expect(() => {
      getTenantOrganizationsByTenantUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

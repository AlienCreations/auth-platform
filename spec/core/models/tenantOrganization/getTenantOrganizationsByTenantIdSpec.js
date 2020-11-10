'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationsByTenantId = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationsByTenantId'),
      commonMocks                      = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ID;

describe('getTenantOrganizationsByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ID = R.compose(R.prop('tenantId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantOrganizations when given a tenantId of type Number', done => {
    getTenantOrganizationsByTenantId(KNOWN_TEST_TENANT_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ID)),
          R.pluck('tenantId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantId of type String', () => {
    expect(() => {
      getTenantOrganizationsByTenantId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantOrganizationsByTenantId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantId', () => {
    expect(() => {
      getTenantOrganizationsByTenantId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantOrganizationsByTenantId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantId', () => {
    expect(() => {
      getTenantOrganizationsByTenantId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});

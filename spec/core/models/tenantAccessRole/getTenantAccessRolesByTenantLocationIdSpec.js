'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantOrganizationId = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRolesByTenantOrganizationId'),
      commonMocks                                = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('getTenantAccessRolesByTenantOrganizationId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_ID = R.compose(R.prop('tenantOrganizationId'), R.last, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoles when given a tenantOrganizationId of type Number', done => {
    getTenantAccessRolesByTenantOrganizationId(KNOWN_TEST_TENANT_ORGANIZATION_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ORGANIZATION_ID)),
          R.pluck('tenantOrganizationId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantOrganizationId of type String', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});

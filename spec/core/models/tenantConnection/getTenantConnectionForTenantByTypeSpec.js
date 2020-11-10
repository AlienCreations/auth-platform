'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionForTenantOrganizationByType = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionsForTenantOrganizationByType'),
      commonMocks                                    = require('../../../_helpers/commonMocks');

const KNOWN_TEST_CONNECTION_TYPE = 1;

let KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('getTenantConnectionForTenantOrganizationByType', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_ID = R.compose(R.prop('tenantOrganizationId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a tenantConnections when given a tenantOrganizationId of type Number', done => {
    getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_ID, KNOWN_TEST_CONNECTION_TYPE).then(data => {
      expect(R.is(Object, data[0])).toBe(true);
      expect(data[0].tenantOrganizationId).toBe(KNOWN_TEST_TENANT_ORGANIZATION_ID);
      done();
    });
  });

  it('throws an error when given a tenantOrganizationId of type String', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType('1', KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a connection type of type String', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_ID, '1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative tenantOrganizationId', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(-22, KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_ID, -22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string for tenantOrganizationId', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType('foo', KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string for connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_ID, 'bar');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationId', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(null, KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_ID, null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});

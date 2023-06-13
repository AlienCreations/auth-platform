'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationById = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationById'),
      commonMocks               = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('getTenantOrganizationById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantOrganization when given an id of type Number', done => {
    getTenantOrganizationById(KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(data.id).toBe(KNOWN_TEST_TENANT_ORGANIZATION_ID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getTenantOrganizationById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantOrganizationById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getTenantOrganizationById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantOrganizationById('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getTenantOrganizationById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

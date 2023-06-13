'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantByDomain = require('../../../../server/core/models/tenant/methods/getTenantByDomain'),
      commonMocks       = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_DOMAIN,
    KNOWN_TEST_TENANT_UUID;

describe('getTenantByDomain', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_DOMAIN = R.compose(R.prop('domain'), R.head)(data);
      KNOWN_TEST_TENANT_UUID   = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenant when given an domain of type String', done => {
    getTenantByDomain(KNOWN_TEST_TENANT_DOMAIN)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('uuid', data)).toBe(KNOWN_TEST_TENANT_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an domain of type Number', () => {
    expect(() => {
      getTenantByDomain(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantByDomain();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getTenantByDomain(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantByUuid = require('../../../../server/core/models/tenant/methods/getTenantByUuid'),
      commonMocks     = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_UUID;

describe('getTenantByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenant when given a valid uuid', done => {
    getTenantByUuid(KNOWN_TEST_TENANT_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('uuid', data)).toBe(KNOWN_TEST_TENANT_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getTenantByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null uuid', () => {
    expect(() => {
      getTenantByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

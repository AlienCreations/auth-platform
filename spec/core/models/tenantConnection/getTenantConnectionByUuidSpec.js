'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionByUuid = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionByUuid'),
      commonMocks               = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_CONNECTION_UUID;

describe('getTenantConnectionByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTION_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenantConnection when given a valid uuid', done => {
    getTenantConnectionByUuid(KNOWN_TEST_TENANT_CONNECTION_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('uuid', data)).toBe(KNOWN_TEST_TENANT_CONNECTION_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getTenantConnectionByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantConnectionByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null uuid', () => {
    expect(() => {
      getTenantConnectionByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

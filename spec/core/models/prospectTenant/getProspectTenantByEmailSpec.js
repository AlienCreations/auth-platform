'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantByEmail = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantByEmail'),
      commonMocks              = require('../../../_helpers/commonMocks');

let KNOWN_TEST_EMAIL;

describe('getProspectTenantByEmail', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_EMAIL = R.compose(R.prop('email'), R.head)(data);
      done();
    });
  });

  it('gets a prospect user when given a valid email', done => {
    getProspectTenantByEmail(KNOWN_TEST_EMAIL)
      .then(data => {
        expect(R.type(R.prop('id', data))).toBe('Number');
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown email', done => {
    getProspectTenantByEmail('foo@bar.com')
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      getProspectTenantByEmail('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an email of type other than String', () => {
    expect(() => {
      getProspectTenantByEmail(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      getProspectTenantByEmail();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when email is set to null', () => {
    expect(() => {
      getProspectTenantByEmail(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

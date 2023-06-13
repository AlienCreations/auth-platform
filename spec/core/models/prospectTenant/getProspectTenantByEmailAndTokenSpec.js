'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantByEmailAndToken = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantByEmailAndToken');

const FAKE_UNKNOWN_EMAIL   = 'zxc@zxzxc.com',
      FAKE_UNKNOWN_TOKEN   = 'asdasdasd',
      FAKE_MALFORMED_EMAIL = 'foo',
      FAKE_MALFORMED_TOKEN = '*'.repeat(300);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_TENANT_DATA,
    KNOWN_TEST_EMAIL,
    KNOWN_TEST_TOKEN;

describe('getProspectTenantByEmailAndToken', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EMAIL                = KNOWN_TEST_PROSPECT_TENANT_DATA.email;
      KNOWN_TEST_TOKEN                = KNOWN_TEST_PROSPECT_TENANT_DATA.token;

      done();
    });
  });

  it('returns prospectTenantData when looking for an prospectTenant by email', done => {
    getProspectTenantByEmailAndToken(KNOWN_TEST_EMAIL, KNOWN_TEST_TOKEN)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_TENANT_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a prospectTenant that does not exist', done => {
    getProspectTenantByEmailAndToken(FAKE_UNKNOWN_EMAIL, KNOWN_TEST_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when looking for a prospectTenant given an incorrect token', done => {
    getProspectTenantByEmailAndToken(KNOWN_TEST_EMAIL, FAKE_UNKNOWN_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      getProspectTenantByEmailAndToken(FAKE_MALFORMED_EMAIL, KNOWN_TEST_TOKEN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed token', () => {
    expect(() => {
      getProspectTenantByEmailAndToken(KNOWN_TEST_EMAIL, FAKE_MALFORMED_TOKEN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when looking for an prospectTenant with no params', () => {
    expect(() => {
      getProspectTenantByEmailAndToken();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null email', () => {
    expect(() => {
      getProspectTenantByEmailAndToken(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});

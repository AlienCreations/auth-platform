'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantByDomain = require('../../../../server/core/controllers/api/tenant/getTenantByDomain');

const KNOWN_TEST_DOMAIN            = 'nyt',
      FAKE_UNKNOWN_TENANT_DOMAIN   = 'xxxxxxxxx',
      FAKE_MALFORMED_TENANT_DOMAIN = 1234;

let KNOWN_TEST_TENANT_DATA;

describe('tenantCtrl.getTenantByDomain', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_DATA = R.compose(R.omit(['secret']), R.find(R.propEq('domain', KNOWN_TEST_DOMAIN)), commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('returns tenantData when looking for a tenant by domain', done => {
    getTenantByDomain(KNOWN_TEST_DOMAIN)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_DATA);
        done();
      });
  });

  it('throws an error when looking for a tenant that does not exist', done => {
    getTenantByDomain(FAKE_UNKNOWN_TENANT_DOMAIN)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed domain', done => {
    getTenantByDomain(FAKE_MALFORMED_TENANT_DOMAIN)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenant without an domain', done => {
    getTenantByDomain()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantByDomain(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

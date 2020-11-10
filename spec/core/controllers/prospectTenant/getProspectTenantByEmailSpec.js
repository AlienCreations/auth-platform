'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantByEmail = require('../../../../server/core/controllers/api/prospectTenant/getProspectTenantByEmail');

const FAKE_UNKNOWN_EMAIL   = 'zxc@zxzxc.com',
      FAKE_MALFORMED_EMAIL = 'foo';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_TENANT_DATA,
    KNOWN_TEST_EMAIL;

describe('prospectTenantCtrl.getProspectTenantByEmail', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EMAIL                = R.prop('email', KNOWN_TEST_PROSPECT_TENANT_DATA);
      done();
    });
  });

  it('returns prospectTenantData when looking for an prospectTenant by email', done => {
    getProspectTenantByEmail(KNOWN_TEST_EMAIL)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_TENANT_DATA));
        done();
      });
  });

  it('throws an error when looking for an prospectTenant that does not exist', done => {
    getProspectTenantByEmail(FAKE_UNKNOWN_EMAIL)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed email', done => {
    getProspectTenantByEmail(FAKE_MALFORMED_EMAIL)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an prospectTenant without an email', done => {
    getProspectTenantByEmail()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null email', done => {
    getProspectTenantByEmail(null)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

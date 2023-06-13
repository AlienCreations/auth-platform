'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantById = require('../../../../server/core/controllers/api/prospectTenant/getProspectTenantById');

const FAKE_UNKNOWN_ID   = 999,
      FAKE_MALFORMED_ID = 'foo';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_TENANT_DATA,
    KNOWN_TEST_ID;

describe('prospectTenantCtrl.getProspectTenantById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_ID                   = R.prop('id', KNOWN_TEST_PROSPECT_TENANT_DATA);
      done();
    });
  });

  it('returns prospectTenantData when looking for an prospectTenant by id', done => {
    getProspectTenantById(KNOWN_TEST_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_TENANT_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an prospectTenant that does not exist', done => {
    getProspectTenantById(FAKE_UNKNOWN_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getProspectTenantById(FAKE_MALFORMED_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an prospectTenant without an id', done => {
    getProspectTenantById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null id', done => {
    getProspectTenantById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

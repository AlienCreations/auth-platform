'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantByUuid = require('../../../../server/core/controllers/api/prospectTenant/getProspectTenantByUuid');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'foo';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_TENANT_DATA,
    KNOWN_TEST_UUID;

describe('prospectTenantCtrl.getProspectTenantByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_UUID                 = KNOWN_TEST_PROSPECT_TENANT_DATA.uuid;
      done();
    });
  });

  it('returns prospectTenantData when looking for an prospectTenant by uuid', done => {
    getProspectTenantByUuid(KNOWN_TEST_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_TENANT_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an prospectTenant that does not exist', done => {
    getProspectTenantByUuid(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getProspectTenantByUuid(FAKE_MALFORMED_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an prospectTenant without an uuid', done => {
    getProspectTenantByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null uuid', done => {
    getProspectTenantByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

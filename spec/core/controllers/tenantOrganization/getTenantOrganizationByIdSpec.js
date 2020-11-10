'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationById = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationById');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const FAKE_UNKNOWN_TENANT_ORGANIZATION_ID   = 999,
      FAKE_MALFORMED_TENANT_ORGANIZATION_ID = 'foo';

let KNOWN_TEST_TENANT_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('tenantOrganizationCtrl.getTenantOrganizationById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ORGANIZATION_ID   = KNOWN_TEST_TENANT_ORGANIZATION_DATA.id;
      done();
    });
  });

  it('returns tenantOrganizationData when looking for a tenantOrganization by id', done => {
    getTenantOrganizationById(KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_TENANT_ORGANIZATION_DATA));
        done();
      });
  });

  it('throws an error when looking for a tenantOrganization that does not exist', done => {
    getTenantOrganizationById(FAKE_UNKNOWN_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantOrganizationById(FAKE_MALFORMED_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenantOrganization without an id', done => {
    getTenantOrganizationById()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantOrganizationById(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

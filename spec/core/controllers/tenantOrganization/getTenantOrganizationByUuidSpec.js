'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByUuid = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationByUuid');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ORGANIZATION_UUID = 'foo';

let KNOWN_TEST_TENANT_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('tenantOrganizationCtrl.getTenantOrganizationByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = KNOWN_TEST_TENANT_ORGANIZATION_DATA.uuid;
      done();
    });
  });

  it('returns tenantOrganizationData when looking for a tenantOrganization by uuid', done => {
    getTenantOrganizationByUuid(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_TENANT_ORGANIZATION_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a tenantOrganization that does not exist', done => {
    getTenantOrganizationByUuid(FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getTenantOrganizationByUuid(FAKE_MALFORMED_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenantOrganization without a uuid', done => {
    getTenantOrganizationByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantOrganizationByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

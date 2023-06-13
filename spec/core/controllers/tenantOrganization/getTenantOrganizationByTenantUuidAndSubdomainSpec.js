'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByTenantUuidAndSubdomain = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationByTenantUuidAndSubdomain');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const A_STRING = 'foo',
      A_NUMBER = 123;

const FAKE_UNKNOWN_TENANT_UUID = commonMocks.COMMON_UUID,
      FAKE_UNKNOWN_SUBDOMAIN   = 'blah';

let KNOWN_TEST_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_SUBDOMAIN;

describe('tenantOrganizationCtrl.getTenantOrganizationByTenantUuidAndSubdomain', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, _data) => {
      const data = R.compose(
        R.sortBy(R.prop('city')),
        commonMocks.transformDbColsToJsProps,
        R.reject(R.propEq(0, 'status'))
      )(_data);

      KNOWN_TEST_TENANT_UUID       = data[0].tenantUuid;
      KNOWN_TEST_SUBDOMAIN         = data[0].subdomain;
      KNOWN_TEST_ORGANIZATION_DATA = R.compose(
        R.omit(privateFields),
        R.head,
        R.filter(R.propEq(KNOWN_TEST_SUBDOMAIN, 'subdomain')),
        R.filter(R.propEq(KNOWN_TEST_TENANT_UUID, 'tenantUuid'))
      )(data);

      done();
    });
  });

  it('returns organizationData when looking for a organization by tenantUuid and subdomain', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, KNOWN_TEST_SUBDOMAIN)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_ORGANIZATION_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a organization from a tenant that does not exist', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(FAKE_UNKNOWN_TENANT_UUID, KNOWN_TEST_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when looking for a organization from a tenant using an unknown subdomain', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, FAKE_UNKNOWN_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a tenantUuid of type other than Number', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(A_STRING, KNOWN_TEST_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when given a subdomain of type other than String', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, A_NUMBER)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when params are omitted', done => {
    getTenantOrganizationByTenantUuidAndSubdomain()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null tenantUuid', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(null, KNOWN_TEST_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null subdomain', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

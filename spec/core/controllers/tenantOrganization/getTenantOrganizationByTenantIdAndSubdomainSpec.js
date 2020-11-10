'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByTenantIdAndSubdomain = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationByTenantIdAndSubdomain');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields    = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS),
      sortAndTransform = R.compose(R.sortBy(R.prop('city')), commonMocks.transformDbColsToJsProps);

const A_STRING = 'foo',
      A_NUMBER = 123;

const FAKE_UNKNOWN_TENANT_ID = 999,
      FAKE_UNKNOWN_SUBDOMAIN = 'blah';

let KNOWN_TEST_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_SUBDOMAIN;


describe('tenantOrganizationCtrl.getTenantOrganizationByTenantIdAndSubdomain', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ID         = data[0].tenantId;
      KNOWN_TEST_SUBDOMAIN         = data[0].subdomain;
      KNOWN_TEST_ORGANIZATION_DATA = R.compose(
        R.omit(privateFields),
        R.head,
        R.filter(R.propEq('subdomain', KNOWN_TEST_SUBDOMAIN)),
        R.filter(R.propEq('tenantId', KNOWN_TEST_TENANT_ID))
      )(data);
      done();
    });
  });

  it('returns organizationData when looking for a organization by tenantId and subdomain', done => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, KNOWN_TEST_SUBDOMAIN)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_ORGANIZATION_DATA);
        done();
      });
  });

  it('throws an error when looking for a organization from a tenant that does not exist', done => {
    getTenantOrganizationByTenantIdAndSubdomain(FAKE_UNKNOWN_TENANT_ID, KNOWN_TEST_SUBDOMAIN)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when looking for a organization from a tenant using an unknown subdomain', done => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, FAKE_UNKNOWN_SUBDOMAIN)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a tenantId of type other than Number', done => {
    getTenantOrganizationByTenantIdAndSubdomain(A_STRING, KNOWN_TEST_SUBDOMAIN)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when given a subdomain of type other than String', done => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, A_NUMBER)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });


  it('throws an error when params are omitted', done => {
    getTenantOrganizationByTenantIdAndSubdomain()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null tenantId', done => {
    getTenantOrganizationByTenantIdAndSubdomain(null, KNOWN_TEST_SUBDOMAIN)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null subdomain', done => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

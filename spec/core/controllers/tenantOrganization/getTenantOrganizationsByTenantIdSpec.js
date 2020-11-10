'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationsByTenantId = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationsByTenantId');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields    = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS),
      sortAndTransform = R.compose(R.sortBy(R.prop('city')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ID   = 999,
      FAKE_MALFORMED_TENANT_ID = 'foo';

let KNOWN_TEST_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_ID;

describe('tenantOrganizationCtrl.getTenantOrganizationsByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ID         = R.compose(R.prop('id'), R.head)(data);
      KNOWN_TEST_ORGANIZATION_DATA = R.compose(
        R.map(R.omit(privateFields)),
        R.filter(R.propEq('tenantId', KNOWN_TEST_TENANT_ID))
      )(data);
      done();
    });
  });

  it('returns organizationData when looking for a organization by tenantId', done => {
    getTenantOrganizationsByTenantId(KNOWN_TEST_TENANT_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.map(R.omit(privateFields), KNOWN_TEST_ORGANIZATION_DATA));
        done();
      });
  });

  it('fails gracefully when looking for organizations from a tenant that does not exist', done => {
    getTenantOrganizationsByTenantId(FAKE_UNKNOWN_TENANT_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantId', done => {
    getTenantOrganizationsByTenantId(FAKE_MALFORMED_TENANT_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an organization without a tenantId', done => {
    getTenantOrganizationsByTenantId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantOrganizationsByTenantId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});

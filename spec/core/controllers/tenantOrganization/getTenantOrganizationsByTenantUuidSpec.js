'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationsByTenantId = require('../../../../server/core/controllers/api/tenantOrganization/getTenantOrganizationsByTenantUuid');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const FAKE_UNKNOWN_TENANT_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_UUID = 'foo';

let KNOWN_TEST_ORGANIZATION_DATA,
    KNOWN_TEST_TENANT_UUID;

describe('tenantOrganizationCtrl.getTenantOrganizationsByTenantId', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, _data) => {
      const data = R.compose(
        R.sortBy(R.prop('city')),
        commonMocks.transformDbColsToJsProps,
        R.reject(R.propEq(0, 'status'))
      )(_data);

      KNOWN_TEST_TENANT_UUID       = R.compose(R.prop('uuid'), R.head)(data);
      KNOWN_TEST_ORGANIZATION_DATA = R.compose(
        R.map(R.omit(privateFields)),
        R.filter(R.propEq(KNOWN_TEST_TENANT_UUID, 'tenantUuid'))
      )(data);
      done();
    });
  });

  it('returns organizationData when looking for a organization by tenantUuid', done => {
    getTenantOrganizationsByTenantId(KNOWN_TEST_TENANT_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.map(R.omit(privateFields), KNOWN_TEST_ORGANIZATION_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for organizations from a tenant that does not exist', done => {
    getTenantOrganizationsByTenantId(FAKE_UNKNOWN_TENANT_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantUuid', done => {
    getTenantOrganizationsByTenantId(FAKE_MALFORMED_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an organization without a tenantUuid', done => {
    getTenantOrganizationsByTenantId()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantOrganizationsByTenantId(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

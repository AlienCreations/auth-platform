'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessRole = require('../../../../server/core/controllers/api/tenantAccessRole/createTenantAccessRole'),
      commonMocks            = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TITLE         = 'foobar',
      FAKE_STATUS_ACTIVE = 1;


let FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION,
    FAKE_TENANT_ACCESS_ROLE_DATA,
    FAKE_TENANT_ACCESS_ROLE_DATA_INCOMPLETE,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    mergeInsertId;

describe('tenantAccessRoleCtrl.createTenantAccessRole', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {
      const data = R.map(R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      ))(_data);

      FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_ROLE_DATA),
        R.pick(['title', 'tenantOrganizationUuid', 'tenantUuid']),
        R.last
      )(data);

      KNOWN_TEST_TENANT_UUID              = FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION.tenantUuid;
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION.tenantOrganizationUuid;

      FAKE_TENANT_ACCESS_ROLE_DATA = {
        tenantUuid             : KNOWN_TEST_TENANT_UUID,
        tenantOrganizationUuid : KNOWN_TEST_TENANT_ORGANIZATION_UUID,
        title                  : FAKE_TITLE,
        status                 : FAKE_STATUS_ACTIVE
      };

      FAKE_TENANT_ACCESS_ROLE_DATA_INCOMPLETE = R.omit(['tenantUuid'], FAKE_TENANT_ACCESS_ROLE_DATA);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));

      done();
    });
  });

  it('returns FAKE_TENANT_ACCESS_ROLE_DATA when creating an tenantAccessRole with all correct params', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_ROLE_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating an tenantAccessRole with incomplete params', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessRole (title should be unique per tenant/organization)', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

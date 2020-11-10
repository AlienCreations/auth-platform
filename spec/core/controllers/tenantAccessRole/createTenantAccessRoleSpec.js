'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessRole = require('../../../../server/core/controllers/api/tenantAccessRole/createTenantAccessRole'),
      commonMocks            = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const KNOWN_TEST_TENANT_ID                    = 2,
      KNOWN_TEST_TENANT_ORGANIZATION_ID       = 2,
      FAKE_TITLE                              = 'foobar',
      FAKE_STATUS_ACTIVE                      = 1,
      FAKE_TENANT_ACCESS_ROLE_DATA            = {
        tenantId             : KNOWN_TEST_TENANT_ID,
        tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID,
        title                : FAKE_TITLE,
        status               : FAKE_STATUS_ACTIVE
      },
      FAKE_TENANT_ACCESS_ROLE_DATA_INCOMPLETE = R.omit(['tenantId'], FAKE_TENANT_ACCESS_ROLE_DATA);

let FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION,
    mergeInsertId;

describe('tenantAccessRoleCtrl.createTenantAccessRole', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      data = R.map(commonMocks.ensureTrueNullInCsvData, data);

      FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_ROLE_DATA),
        commonMocks.transformDbColsToJsProps,
        R.pick(['title', 'tenant_organization_id', 'tenant_id']),
        R.last
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));

      done();
    });
  });

  it('returns FAKE_TENANT_ACCESS_ROLE_DATA when creating an tenantAccessRole with all correct params', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_ROLE_DATA)));
        done();
      });
  });

  it('throws an error when creating an tenantAccessRole with incomplete params', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessRole (title should be unique per tenant/organization)', done => {
    createTenantAccessRole(FAKE_TENANT_ACCESS_ROLE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_TITLE_AND_ORGANIZATION)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

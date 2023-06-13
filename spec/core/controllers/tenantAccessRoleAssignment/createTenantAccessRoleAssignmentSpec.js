'use strict';

const R                                    = require('ramda'),
      path                                 = require('path'),
      config                               = require('config'),
      CSVConverter                         = require('csvtojson').Converter,
      tenantAccessRoleAssignmentsConverter = new CSVConverter({}),
      cloudUsersConverter                  = new CSVConverter({});

const createTenantAccessRoleAssignment = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/createTenantAccessRoleAssignment'),
      commonMocks                      = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

let FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_UUID,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
    FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_INCOMPLETE,
    mergeInsertId;

describe('tenantAccessRoleAssignmentCtrl.createTenantAccessRoleAssignment', () => {
  beforeAll(done => {
    cloudUsersConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID = R.compose(R.prop('uuid'), R.last)(data);

      tenantAccessRoleAssignmentsConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {
        const data = R.compose(
          commonMocks.ensureTrueNullInCsvData,
          commonMocks.transformDbColsToJsProps
        )(_data);

        KNOWN_TEST_TENANT_ACCESS_ROLE_UUID                 = R.compose(R.prop('tenantAccessRoleUuid'), R.head)(data);
        FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA            = {
          tenantAccessRoleUuid : KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
          cloudUserUuid        : KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
          status               : 1
        };
        FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_INCOMPLETE = R.omit(['tenantAccessRoleUuid'], FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA);

        FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_UUID = R.compose(
          R.mergeDeepRight(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA),
          R.pick(['cloudUserUuid']),
          R.head
        )(data);

        mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));
        done();
      });
    });
  });

  it('returns FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA when creating an tenantAccessRoleAssignment with all correct params', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating an tenantAccessRoleAssignment with incomplete params', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessRoleAssignment (cloudUserUuid should be unique per tenantAccessRole)', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

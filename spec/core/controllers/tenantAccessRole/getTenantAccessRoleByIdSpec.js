'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleById = require('../../../../server/core/controllers/api/tenantAccessRole/getTenantAccessRoleById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID   = 9999,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ID;

describe('tenantAccessRoleCtrl.getTenantAccessRoleById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID   = KNOWN_TEST_TENANT_ACCESS_ROLE_DATA.id;
      done();
    });
  });

  it('returns tenantAccessRoleData when looking for an tenantAccessRole by id', done => {
    getTenantAccessRoleById(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        expect(res.referenceId)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_ROLE_DATA.referenceId);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessRole that does not exist', done => {
    getTenantAccessRoleById(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantAccessRoleById(FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessRole without an id', done => {
    getTenantAccessRoleById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});

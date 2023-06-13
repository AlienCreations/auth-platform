'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/createTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);


const FAKE_TITLE            = 'foobar',
      FAKE_URI              = '/foo/bar',
      FAKE_KEY              = 'foo-bar',
      FAKE_METHOD_SUPPORTED = 'PUT',
      FAKE_STATUS_ACTIVE    = 1;

let FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_TITLE,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI_METHOD,
    FAKE_TENANT_ACCESS_RESOURCE_DATA,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_INCOMPLETE,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_UUID,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_UUID,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_UUIDS,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID,
    mergeInsertId;

describe('tenantAccessResourceCtrl.createTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {
      const data = R.map(R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      ))(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID        = R.compose(R.prop('tenantOrganizationUuid'), R.last)(data);
      KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID = R.compose(R.prop('tenantUuid'), R.last)(data);

      FAKE_TENANT_ACCESS_RESOURCE_DATA = {
        tenantOrganizationUuid : KNOWN_TEST_TENANT_ORGANIZATION_UUID,
        tenantUuid             : KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID,
        title                  : FAKE_TITLE,
        key                    : FAKE_KEY,
        uri                    : FAKE_URI,
        method                 : FAKE_METHOD_SUPPORTED,
        status                 : FAKE_STATUS_ACTIVE
      };

      FAKE_TENANT_ACCESS_RESOURCE_DATA_INCOMPLETE                              = R.omit(['title'], FAKE_TENANT_ACCESS_RESOURCE_DATA);
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_UUID                   = R.assoc('tenantUuid', null, FAKE_TENANT_ACCESS_RESOURCE_DATA);
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_UUID      = R.assoc('tenantOrganizationUuid', null, FAKE_TENANT_ACCESS_RESOURCE_DATA);
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_UUIDS = R.assoc('tenantOrganizationUuid', null, FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_UUID);

      // These mocks work because our known tenant id and tenant organization id match the 'last' entry in the CSV.
      // If that entry changes, these should change
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_TITLE = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_RESOURCE_DATA),
        R.pick(['title']),
        R.last
      )(data);

      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_RESOURCE_DATA),
        R.pick(['key']),
        R.last
      )(data);

      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI_METHOD = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_RESOURCE_DATA),
        R.pick(['uri', 'method']),
        R.last
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));

      done();
    });
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with all correct params', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with a null tenantUuid', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_UUID)));
        done();
      })
      .catch(done.fail);
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with a null tenantOrganizationUuid', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_UUID)));
        done();
      })
      .catch(done.fail);
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with null tenantUuid and tenantOrganizationUuid', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_UUIDS)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_UUIDS)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating an tenantAccessResource with incomplete params', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (title should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_TITLE)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (key should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (uri/method composite key should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI_METHOD)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

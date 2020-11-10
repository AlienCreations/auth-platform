'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/createTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const KNOWN_TEST_TENANT_ORGANIZATION_ID        = 2,
      KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_ID = 2;

const FAKE_TITLE                                                             = 'foobar',
      FAKE_URI                                                               = '/foo/bar',
      FAKE_KEY                                                               = 'foo-bar',
      FAKE_METHOD_SUPPORTED                                                  = 'PUT',
      FAKE_STATUS_ACTIVE                                                     = 1,
      FAKE_TENANT_ACCESS_RESOURCE_DATA                                       = {
        tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID,
        tenantId             : KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_ID,
        title                : FAKE_TITLE,
        key                  : FAKE_KEY,
        uri                  : FAKE_URI,
        method               : FAKE_METHOD_SUPPORTED,
        status               : FAKE_STATUS_ACTIVE
      },
      FAKE_TENANT_ACCESS_RESOURCE_DATA_INCOMPLETE                            = R.omit(['title'], FAKE_TENANT_ACCESS_RESOURCE_DATA),
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ID                   = R.assoc('tenantId', null, FAKE_TENANT_ACCESS_RESOURCE_DATA),
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_ID      = R.assoc('tenantOrganizationId', null, FAKE_TENANT_ACCESS_RESOURCE_DATA),
      FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_IDS = R.assoc('tenantOrganizationId', null, FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ID);

let FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_TITLE,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY,
    FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI_METHOD,
    mergeInsertId;

describe('tenantAccessResourceCtrl.createTenantAccessResource', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {

      const data = R.map(commonMocks.ensureTrueNullInCsvData, _data);

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
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA)));
        done();
      });
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with a null tenantId', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ID)));
        done();
      });
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with a null tenantOrganizationId', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_ORGANIZATION_ID)));
        done();
      });
  });

  it('returns FAKE_TENANT_ACCESS_RESOURCE_DATA when creating an tenantAccessResource with null tenantId and tenantOrganizationId', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_IDS)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_NULL_TENANT_AND_ORGANIZATION_IDS)));
        done();
      });
  });

  it('throws an error when creating an tenantAccessResource with incomplete params', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (title should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_TITLE)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (key should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_KEY)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessResource (uri/method composite key should be unique)', done => {
    createTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_RESOURCE_URI_METHOD)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

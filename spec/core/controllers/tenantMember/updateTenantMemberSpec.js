'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantMember = require('../../../../server/core/controllers/api/tenantMember/updateTenantMember');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_MEMBER_UPDATE_DATA = {
        referenceId : 'fakeid'
      },
      FAKE_UNKNOWN_TENANT_MEMBER_ID  = 9999;

let KNOWN_TEST_TENANT_MEMBER_DATA,
    KNOWN_TEST_EXISTING_REFERENCE_ID,
    FAKE_TENANT_MEMBER_UPDATE_DATA_EXISTING_REFERENCE_ID,
    KNOWN_TEST_TENANT_MEMBER_ID,
    updatedTenantMemberData;

const referenceIdLens = R.lensPath(['referenceId']);

describe('tenantMemberCtrl.updateTenantMember', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {

      KNOWN_TEST_TENANT_MEMBER_DATA                        = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_MEMBER_ID                          = KNOWN_TEST_TENANT_MEMBER_DATA.id;
      KNOWN_TEST_EXISTING_REFERENCE_ID                     = R.compose(R.prop('referenceId'), R.last, commonMocks.transformDbColsToJsProps)(data);
      FAKE_TENANT_MEMBER_UPDATE_DATA_EXISTING_REFERENCE_ID = R.set(referenceIdLens, KNOWN_TEST_EXISTING_REFERENCE_ID, R.omit(['id'], KNOWN_TEST_TENANT_MEMBER_DATA));

      updatedTenantMemberData = R.omit(COMMON_PRIVATE_FIELDS, R.mergeDeepRight(KNOWN_TEST_TENANT_MEMBER_DATA, FAKE_TENANT_MEMBER_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenantMember when provided an id and new properties to update', done => {
    updateTenantMember(FAKE_TENANT_MEMBER_UPDATE_DATA, KNOWN_TEST_TENANT_MEMBER_ID)
      .then(res => {
        expect(res.referenceId)
          .toEqual(updatedTenantMemberData.referenceId);
        done();
      });
  });

  it('throws an error when updating an tenantMember that does not exist', done => {
    updateTenantMember(FAKE_TENANT_MEMBER_UPDATE_DATA, FAKE_UNKNOWN_TENANT_MEMBER_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing referenceId for a mapped tenant', done => {
    updateTenantMember(FAKE_TENANT_MEMBER_UPDATE_DATA_EXISTING_REFERENCE_ID, KNOWN_TEST_TENANT_MEMBER_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

});

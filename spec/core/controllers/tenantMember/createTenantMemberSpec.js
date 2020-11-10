'use strict';

const R                     = require('ramda'),
      RA                    = require('ramda-adjunct'),
      path                  = require('path'),
      CSVConverter          = require('csvtojson').Converter,
      tenantMemberConverter = new CSVConverter({}),
      cloudUserConverter    = new CSVConverter({});

const createTenantMember = require('../../../../server/core/controllers/api/tenantMember/createTenantMember'),
      commonMocks        = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TENANT_ID               = 2,
      KNOWN_TEST_UNMAPPED_CLOUD_USER_ID  = 4,
      FAKE_REFERENCE_ID                  = 'xxxxx12345',
      FAKE_TENANT_MEMBER_DATA            = {
        tenantId    : KNOWN_TEST_TENANT_ID,
        cloudUserId : KNOWN_TEST_UNMAPPED_CLOUD_USER_ID,
        referenceId : FAKE_REFERENCE_ID,
        status      : 1
      },
      FAKE_TENANCY                       = {
        tenant : {
          title : 'Some Tenant'
        },
        tenantOrganization : {
          title : 'Some Organization'
        }
      },
      FAKE_TENANT_MEMBER_DATA_INCOMPLETE = R.omit(['tenantId'], FAKE_TENANT_MEMBER_DATA);

let FAKE_TENANT_MEMBER_DATA_WITH_KNOWN_TEST_TENANT_MEMBER_REFERENCE_ID,
    KNOWN_TEST_MAPPED_CLOUD_USER_DATA,
    MERGED_TENANT_MEMBER_DATA,
    mergeInsertId,
    FakeMailSvc;

describe('tenantMemberCtrl.createTenantMember', () => {

  beforeAll(done => {
    tenantMemberConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, tenantMemberData) => {
      cloudUserConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, cloudUserData) => {

        KNOWN_TEST_MAPPED_CLOUD_USER_DATA = R.compose(
          RA.renameKeys({ id : 'cloudUserId' }),
          commonMocks.transformDbColsToJsProps,
          R.find(R.propEq('id', FAKE_TENANT_MEMBER_DATA.cloudUserId))
        )(cloudUserData);

        mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(tenantMemberData));

        MERGED_TENANT_MEMBER_DATA = R.compose(
          mergeInsertId,
          R.pick([
            'referenceId',
            'tenantId',
            'cloudUserId',
            'id',
            'status',
            'firstName',
            'lastName',
            'gender',
            'email',
            'phone',
            'alternatePhone',
            'pointsBalance',
            'portrait',
            'birthday',
            'address1',
            'address2',
            'city',
            'state',
            'zip'
          ]),
          R.mergeDeepRight(KNOWN_TEST_MAPPED_CLOUD_USER_DATA)
        )(FAKE_TENANT_MEMBER_DATA);

        FAKE_TENANT_MEMBER_DATA_WITH_KNOWN_TEST_TENANT_MEMBER_REFERENCE_ID = R.compose(
          R.mergeDeepRight(FAKE_TENANT_MEMBER_DATA),
          R.objOf('referenceId'),
          R.prop('reference_id'),
          R.head
        )(tenantMemberData);

        done();

      });
    });
  });

  beforeEach(() => {
    FakeMailSvc = jasmine.createSpyObj('MailSvc', ['send']);
  });

  it('returns FAKE_TENANT_MEMBER_DATA when creating an tenantMember with all correct params', done => {
    createTenantMember(FAKE_TENANCY, FakeMailSvc, FAKE_TENANT_MEMBER_DATA)
      .then(res => {
        setTimeout(() => {
          expect(FakeMailSvc.send).toHaveBeenCalled();
          expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
            .toEqual(MERGED_TENANT_MEMBER_DATA);
          done();
        }, 10);
      });
  });

  it('throws an error when creating an tenantMember with incomplete params', done => {
    createTenantMember(FAKE_TENANCY, FakeMailSvc, FAKE_TENANT_MEMBER_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantMember (referenceId should be unique per tenant)', done => {
    createTenantMember(FAKE_TENANCY, FakeMailSvc, FAKE_TENANT_MEMBER_DATA_WITH_KNOWN_TEST_TENANT_MEMBER_REFERENCE_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

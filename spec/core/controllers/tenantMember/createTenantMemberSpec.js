'use strict';

const R                     = require('ramda'),
      RA                    = require('ramda-adjunct'),
      path                  = require('path'),
      CSVConverter          = require('csvtojson').Converter,
      tenantMemberConverter = new CSVConverter({}),
      cloudUserConverter    = new CSVConverter({});

const createTenantMember = require('../../../../server/core/controllers/api/tenantMember/createTenantMember'),
      commonMocks        = require('../../../_helpers/commonMocks');

const FAKE_REFERENCE_ID = 'xxxxx12345',
      FAKE_TENANCY      = {
        tenant : {
          title : 'Some Tenant'
        },
        tenantOrganization : {
          title : 'Some Organization'
        }
      };

let FAKE_TENANT_MEMBER_DATA_WITH_KNOWN_TEST_TENANT_MEMBER_REFERENCE_ID,
    FAKE_TENANT_MEMBER_DATA,
    FAKE_TENANT_MEMBER_DATA_INCOMPLETE,
    KNOWN_TEST_MAPPED_CLOUD_USER_DATA,
    KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
    KNOWN_TEST_TENANT_UUID,
    MERGED_TENANT_MEMBER_DATA,
    mergeInsertId,
    FakeMailSvc;

describe('tenantMemberCtrl.createTenantMember', () => {
  beforeAll(done => {
    tenantMemberConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, tenantMemberData) => {
      KNOWN_TEST_TENANT_UUID = R.compose(
        R.prop('tenant_uuid'),
        R.last
      )(tenantMemberData);

      cloudUserConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, cloudUserData) => {
        KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID = R.compose(
          R.prop('uuid'),
          R.last,
          R.reject(R.propEq(0, 'status'))
        )(cloudUserData);

        FAKE_TENANT_MEMBER_DATA = {
          tenantUuid    : KNOWN_TEST_TENANT_UUID,
          cloudUserUuid : KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
          referenceId   : FAKE_REFERENCE_ID,
          status        : 1
        };

        FAKE_TENANT_MEMBER_DATA_INCOMPLETE = R.omit(['tenantUuid'], FAKE_TENANT_MEMBER_DATA);

        KNOWN_TEST_MAPPED_CLOUD_USER_DATA = R.compose(
          R.omit(['id', 'uuid']),
          RA.renameKeys({ uuid : 'cloudUserUuid' }),
          commonMocks.transformDbColsToJsProps,
          R.find(R.propEq(FAKE_TENANT_MEMBER_DATA.cloudUserUuid, 'uuid'))
        )(cloudUserData);

        mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(tenantMemberData));

        MERGED_TENANT_MEMBER_DATA = R.compose(
          mergeInsertId,
          R.pick([
            'referenceId',
            'tenantUuid',
            'cloudUserUuid',
            'id',
            'uuid',
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
    createTenantMember({ MailSvc : FakeMailSvc })(FAKE_TENANCY, FAKE_TENANT_MEMBER_DATA)
      .then(res => {
        setTimeout(() => {
          expect(FakeMailSvc.send).toHaveBeenCalled();
          expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
            .toEqual(MERGED_TENANT_MEMBER_DATA);
          done();
        }, 100);
      })
      .catch(done.fail);
  });

  it('throws an error when creating an tenantMember with incomplete params', done => {
    createTenantMember({ MailSvc : FakeMailSvc })(FAKE_TENANCY, FAKE_TENANT_MEMBER_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantMember (referenceId should be unique per tenant)', done => {
    createTenantMember({ MailSvc : FakeMailSvc })(FAKE_TENANCY, FAKE_TENANT_MEMBER_DATA_WITH_KNOWN_TEST_TENANT_MEMBER_REFERENCE_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

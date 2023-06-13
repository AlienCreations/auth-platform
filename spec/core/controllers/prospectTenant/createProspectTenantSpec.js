'use strict';

const R            = require('ramda'),
      path         = require('path'),
      uuid         = require('uuid/v4'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createProspectTenant = require('../../../../server/core/controllers/api/prospectTenant/createProspectTenant'),
      commonMocks          = require('../../../_helpers/commonMocks');

const FAKE_PROSPECT_TENANT_DATA            = {
        firstName   : 'Testfirstname',
        lastName    : 'Testlastname',
        email       : 'test999@9999.com',
        phone       : '552-123-1231',
        zip         : '12345',
        tenantTitle : 'some tenant title',
        token       : uuid(),
        status      : 1
      },
      FAKE_PROSPECT_TENANT_DATA_INCOMPLETE = R.omit(['email', 'password'], FAKE_PROSPECT_TENANT_DATA);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

let FAKE_PROSPECT_TENANT_DATA_WITH_KNOWN_TEST_PROSPECT_TENANT_EMAIL,
    mergeInsertId,
    FakeMailSvc;

describe('prospectTenantCtrl.createProspectTenant', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {

      FAKE_PROSPECT_TENANT_DATA_WITH_KNOWN_TEST_PROSPECT_TENANT_EMAIL = R.compose(
        R.mergeDeepRight(FAKE_PROSPECT_TENANT_DATA),
        R.objOf('email'),
        R.prop('email'),
        R.head
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data));

      done();
    });
  });

  beforeEach(() => {
    FakeMailSvc = jasmine.createSpyObj('MailSvc', ['send']);
  });

  it('returns FAKE_PROSPECT_TENANT_DATA when creating a prospectTenant with all correct params', done => {
    createProspectTenant(FakeMailSvc)(FAKE_PROSPECT_TENANT_DATA)
      .then(res => {
        expect(FakeMailSvc.send).toHaveBeenCalled();
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(privateFields, mergeInsertId(FAKE_PROSPECT_TENANT_DATA)));
        done();
      });
  });

  it('throws an error when creating a prospectTenant with incomplete params', done => {
    createProspectTenant(FakeMailSvc)(FAKE_PROSPECT_TENANT_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate prospectTenant (email should be unique)', done => {
    createProspectTenant(FakeMailSvc)(FAKE_PROSPECT_TENANT_DATA_WITH_KNOWN_TEST_PROSPECT_TENANT_EMAIL)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

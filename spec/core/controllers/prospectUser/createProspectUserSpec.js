'use strict';

const R            = require('ramda'),
      path         = require('path'),
      uuid         = require('uuid/v4'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createProspectUser = require('../../../../server/core/controllers/api/prospectUser/createProspectUser'),
      commonMocks        = require('../../../_helpers/commonMocks');

const FAKE_PROSPECT_USER_DATA            = {
        firstName : 'Testfirstname',
        lastName  : 'Testlastname',
        email     : 'test999@9999.com',
        zip       : '12345',
        token     : uuid(),
        status    : 1
      },
      FAKE_PROSPECT_USER_DATA_INCOMPLETE = R.omit(['email', 'password'], FAKE_PROSPECT_USER_DATA);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let FAKE_PROSPECT_USER_DATA_WITH_KNOWN_TEST_PROSPECT_USER_EMAIL,
    mergeInsertId,
    FakeMailSvc;

describe('prospectUserCtrl.createProspectUser', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {

      FAKE_PROSPECT_USER_DATA_WITH_KNOWN_TEST_PROSPECT_USER_EMAIL = R.compose(
        R.mergeDeepRight(FAKE_PROSPECT_USER_DATA),
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

  it('returns FAKE_PROSPECT_USER_DATA when creating a prospectUser with all correct params', done => {
    createProspectUser(FakeMailSvc)(FAKE_PROSPECT_USER_DATA)
      .then(res => {
        expect(FakeMailSvc.send).toHaveBeenCalled();
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.compose(
            R.omit(privateFields),
            mergeInsertId
          )(FAKE_PROSPECT_USER_DATA));
        done();
      });
  });

  it('throws an error when creating a prospectUser with incomplete params', done => {
    createProspectUser(FakeMailSvc)(FAKE_PROSPECT_USER_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate prospectUser (email should be unique)', done => {
    createProspectUser(FakeMailSvc)(FAKE_PROSPECT_USER_DATA_WITH_KNOWN_TEST_PROSPECT_USER_EMAIL)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});

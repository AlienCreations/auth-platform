'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateProspectUser    = require('../../../../server/core/models/prospectUser/methods/updateProspectUser'),
      getProspectUserByUuid = require('../../../../server/core/models/prospectUser/methods/getProspectUserByUuid'),
      commonMocks           = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID      = commonMocks.COMMON_UUID,
      FAKE_UPDATE_FIRST_NAME = 'newfoo',
      FAKE_UPDATE_LAST_NAME  = 'newbar',
      FAKE_UPDATE_EMAIL      = 'newfoo@newbar.com';

const A_POSITIVE_NUMBER = 1337,
      A_STRING          = 'foo';

let KNOWN_TEST_PROSPECT_USER_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a prospectUser when given a valid ' + field, done => {
    updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getProspectUserByUuid(KNOWN_TEST_PROSPECT_USER_UUID)
          .then((prospectUser) => {
            expect(R.prop(field, prospectUser)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateProspectUser', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_USER_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('fails gracefully when given an unknown prospectUser uuid to update', done => {
    updateProspectUser(FAKE_UNKNOWN_UUID, {
      firstName : FAKE_UPDATE_FIRST_NAME
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given no data', done => {
    updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, null)
      .then(data => {
        expect(data).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a prospectUser with null uuid', () => {
    expect(() => {
      updateProspectUser(null, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by an uuid of type other than Number', () => {
    expect(() => {
      updateProspectUser(A_STRING, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, {
        firstName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('firstName', FAKE_UPDATE_FIRST_NAME);

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, {
        lastName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('lastName', FAKE_UPDATE_LAST_NAME);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_PROSPECT_USER_UUID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);
});

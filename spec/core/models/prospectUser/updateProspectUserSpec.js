'use strict';

const R = require('ramda');

const updateProspectUser  = require('../../../../server/core/models/prospectUser/methods/updateProspectUser'),
      getProspectUserById = require('../../../../server/core/models/prospectUser/methods/getProspectUserById'),
      commonMocks         = require('../../../_helpers/commonMocks');

const KNOWN_TEST_ID          = 1,
      FAKE_UNKNOWN_ID        = 1337,
      FAKE_UPDATE_FIRST_NAME = 'newfoo',
      FAKE_UPDATE_LAST_NAME  = 'newbar',
      FAKE_UPDATE_EMAIL      = 'newfoo@newbar.com';

const A_POSITIVE_NUMBER = 1337,
      A_STRING          = 'foo';

const assertUpdatesIfValid = (field, value) => {
  it('updates a prospectUser when given a valid ' + field, done => {
    updateProspectUser(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getProspectUserById(KNOWN_TEST_ID)
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

  it('fails gracefully when given an unknown prospectUser id to update', done => {
    updateProspectUser(FAKE_UNKNOWN_ID, {
      firstName : FAKE_UPDATE_FIRST_NAME
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateProspectUser(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('throws an error when updating a prospectUser with null id', () => {
    expect(() => {
      updateProspectUser(null, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateProspectUser(A_STRING, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_ID, {
        firstName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('firstName', FAKE_UPDATE_FIRST_NAME);

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_ID, {
        lastName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('lastName', FAKE_UPDATE_LAST_NAME);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateProspectUser(KNOWN_TEST_ID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

});

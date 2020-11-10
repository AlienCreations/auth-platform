// 'use strict';
//
// const R            = require('ramda'),
//       path         = require('path'),
//       commonMocks  = require('../../../../../../_helpers/commonMocks'),
//       CSVConverter = require('csvtojson').Converter,
//       converter    = new CSVConverter({});
//
// const preflight = require('../../../../../../../server/core/controllers/auth/preflight/strategies/cloudUser/preflight');
//
// const FAKE_EMAIL = 'john@doe.com',
//       FAKE_REQ   = {
//         headers : {
//           'x-forwarded-for' : '1.1.1.1, 2.2.2.2',
//           'x-real-ip'       : '1.1.1.1',
//           'true-client-ip'  : '1.1.1.1'
//         }
//       },
//       FAKE_UNAUTHORIZED_REQ = {
//         headers : {
//           'x-forwarded-for' : '135.180.69.106, 23.60.168.94',
//           'x-real-ip'       : '135.180.69.106',
//           'true-client-ip'  : '135.180.69.106'
//         }
//       };
//
// let KNOWN_TEST_USER_DATA;
// let KNOWN_TEST_EXPIRED_USERNAME;
// let KNOWN_TEST_IP_RESTRICTED_USERNAME;
//
// describe('preflightCtrl.cloudUser', () => {
//
//   beforeAll(done => {
//     converter.fromFile(path.resolve(__dirname, '../../../../../../../run/env/test/seedData/cloudUsers.csv'), (err, data) => {
//
//       KNOWN_TEST_USER_DATA = R.compose(
//         R.find(R.propEq('email', 'saml@aliencreations.com')),
//         commonMocks.transformDbColsToJsProps
//       )(data);
//
//       KNOWN_TEST_EXPIRED_USERNAME = R.compose(
//         R.prop('email'),
//         R.find(R.propEq('isExpired', true)),
//         commonMocks.transformDbColsToJsProps
//       )(data);
//
//       KNOWN_TEST_IP_RESTRICTED_USERNAME = R.compose(
//         R.prop('email'),
//         R.find(R.propEq('email', 'ip_restricted@aliencreations.com')),
//         commonMocks.transformDbColsToJsProps
//       )(data);
//
//       done();
//     });
//   });
//
//   it('returns basic user profile when looking for a user by email', done => {
//     preflight(FAKE_REQ)(KNOWN_TEST_USER_DATA.email)
//       .then(res => {
//         const expectedResponse = {
//           ...KNOWN_TEST_USER_DATA,
//           ...{ oidc : undefined },
//           ...KNOWN_TEST_USER_DATA.authConfig
//         };
//         expect(res).toEqual(R.pick(PUBLIC_FIELDS, expectedResponse));
//         done();
//       });
//   });
//
//   it('throws an error when given an expired email', done => {
//     preflight(FAKE_REQ)(KNOWN_TEST_EXPIRED_USERNAME)
//       .then(done.fail)
//       .catch(err => {
//         expect(err.message).toEqual('Permission denied');
//         done();
//       });
//   });
//
//   it('defaults to a fake profile when given an email does not exists', done => {
//     preflight(FAKE_REQ)(FAKE_EMAIL)
//       .then(res => {
//         expect(res).toEqual({
//           email : FAKE_EMAIL
//         });
//         done();
//       })
//       .catch(done.fail);
//   });
//
//   it('throws an error when not giving an email', done => {
//     preflight(FAKE_REQ)()
//       .then(done.fail)
//       .catch(err => {
//         expect(err.message).toEqual('Missing required property: CLOUDUSERDATA -> email');
//         done();
//       });
//   });
//
//   it('throws an error when req IP is not authorized for given email', done => {
//     preflight(FAKE_UNAUTHORIZED_REQ)(KNOWN_TEST_IP_RESTRICTED_USERNAME)
//       .then(done.fail)
//       .catch(err => {
//         expect(err.message).toEqual('Permission denied');
//         done();
//       });
//   });
//
//   it('returns basic user profile when looking for a user by email with ip restriction and req ip matches', done => {
//     preflight(FAKE_REQ)(KNOWN_TEST_IP_RESTRICTED_USERNAME)
//       .then(({ email }) => {
//         expect(email).toEqual(KNOWN_TEST_IP_RESTRICTED_USERNAME);
//         done();
//       })
//       .catch(done.fail);
//   });
//
//   it('rejects if users cannot be found', done => {
//     process.env.NODE_ENV = 'foo';
//     preflight(FAKE_REQ)(KNOWN_TEST_USER_DATA.email)
//       .then(done.fail)
//       .catch(err => {
//         expect(err.message).toBe(path.resolve(__dirname, '../../../../../../../run/env/foo/seedData/cloudUsers.csv') + ' cannot be found.');
//         process.env.NODE_ENV = 'test';
//         done();
//       });
//   });
// });

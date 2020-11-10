'use strict';

const R      = require('ramda'),
      moment = require('moment'),
      cuid   = require('cuid'),
      config = require('config');

const DB                       = require('../../../utils/db'),
      passwords                = require('../../../utils/password'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForInsert,
      validateCloudUserData    = require('../../cloudUser/helpers/validateCloudUserData').validateForInsert;

const TENANT_MEMBER_PROPS = ['referenceId', 'cloudUserId', 'tenantId'],
      UNVALIDATED_PROPS   = ['timestamp'];

const formatIsoDateToDbTimestamp = isoString => moment(isoString).format('YYYY-MM-DD HH:mm:ss');

const decorateCloudUserDataForDbInsertion = cloudUserData => {
  const dataCopy           = R.clone(cloudUserData),
        saltRoundsExponent = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

  dataCopy.birthday  = formatIsoDateToDbTimestamp(dataCopy.birthday);
  dataCopy.password  = passwords.makePasswordHash(cuid(), saltRoundsExponent);

  return dataCopy;
};

const decorateTenantMemberDataForDbInsertion = tenantMemberData => {
  const dataCopy = R.clone(tenantMemberData);
  return dataCopy;
};

const createCloudUser = data => connection => {

  const fields = R.keys(data);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.cloud_users SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(data)];
  return DB.addQueryToTransaction(connection, queryStatement);
};

const createTenantMember = ({ connection, data }) => {
  const decoratedData = decorateTenantMemberDataForDbInsertion(data);

  const fields = R.keys(data);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.tenant_members SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(decoratedData)];
  return DB.addQueryToTransaction(connection, queryStatement);
};

const mergeCloudUserIdWithTransactionStep = partialTenantMemberData => ({ connection, data }) => {

  const tenantMemberData = R.omit(UNVALIDATED_PROPS, R.mergeDeepRight(partialTenantMemberData, { cloudUserId : data.insertId }));
  validateTenantMemberData(tenantMemberData);

  return {
    connection,
    data : tenantMemberData
  };
};

/**
 * Create a tenantMember record
 * @param {Function} logger
 * @param {Object} mixedData  Some meant for cloudUser record, and at least the referenceId meant for tenantMember record
 * @throws {Error}
 * @returns {Promise}
 */
const enrollTenantMember = logger => mixedData => {

  const _cloudUserData = R.compose(
    R.assoc('password',        cuid()),
    R.assoc('permissionsJson', '{}'),
    R.omit(UNVALIDATED_PROPS),
    R.omit(TENANT_MEMBER_PROPS)
  )(mixedData);

  const partialTenantMemberData = R.pick(TENANT_MEMBER_PROPS, mixedData);

  validateCloudUserData(R.defaultTo({}, _cloudUserData));

  const cloudUserData = decorateCloudUserDataForDbInsertion(_cloudUserData);

  DB.beginTransaction()
    .then(createCloudUser(cloudUserData))
    .then(mergeCloudUserIdWithTransactionStep(partialTenantMemberData))
    .then(createTenantMember)
    .then(R.prop('connection'))
    .then(DB.commit)
    .catch(exception => {
      logger({ cloudUserData, partialTenantMemberData, mixedData }).error(`Exception caught in enrollTenantMember. Rolling back transaction: ${exception}`);
      exception.connection.rollback();
      throw exception;
    });
};

module.exports = enrollTenantMember;

'use strict';

const R      = require('ramda'),
      moment = require('moment'),
      cuid   = require('cuid'),
      uuid   = require('uuid/v4'),
      config = require('config');

const DB                       = require('../../../utils/db'),
      passwords                = require('../../../utils/password'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForInsert,
      validateCloudUserData    = require('../../cloudUser/helpers/validateCloudUserData').validateForInsert;

const TENANT_MEMBER_PROPS = ['referenceId', 'cloudUserUuid', 'tenantUuid'],
      UNVALIDATED_PROPS   = ['timestamp'],
      SALT_ROUNDS_EXPONENT = R.path(['auth', 'SALT_ROUNDS_EXPONENT'], config);

const formatIsoDateToDbTimestamp = isoString => moment(isoString).format('YYYY-MM-DD HH:mm:ss');

const makePassword = () => passwords.makePasswordHash(cuid(), SALT_ROUNDS_EXPONENT);

const decorateCloudUserDataForDbInsertion = R.compose(
  R.modify('birthday', formatIsoDateToDbTimestamp)
);

const decorateTenantMemberDataForDbInsertion = R.identity;

const createCloudUser = data => connection => {
  const fields = R.keys(data);
  const query  = `INSERT INTO ${DB.coreDbName}.cloud_users
                  SET ${DB.prepareProvidedFieldsForSet(fields)}`;

  const queryStatement = [query, DB.prepareValues(data)];
  return DB.addQueryToTransaction(connection, queryStatement);
};

const createTenantMember = ({ connection, data }) => {
  const decoratedData = decorateTenantMemberDataForDbInsertion(data);

  const fields = R.keys(data);
  const query  = `INSERT INTO ${DB.coreDbName}.tenant_members
                  SET ${DB.prepareProvidedFieldsForSet(fields)}`;

  const queryStatement = [query, DB.prepareValues(decoratedData)];
  return DB.addQueryToTransaction(connection, queryStatement);
};

const prepTenantMemberDataForTransaction = partialTenantMemberData => ({ connection }) => {
  const data = R.omit(UNVALIDATED_PROPS, partialTenantMemberData);
  validateTenantMemberData(data);
  return { connection, data };
};

const enrollTenantMember = logger => mixedData => {
  const _cloudUserData = R.compose(
    R.assoc('password', makePassword()),
    R.assoc('uuid', uuid()),
    R.assoc('metaJson', '{}'),
    R.assoc('strategyRefs', '{}'),
    R.assoc('authConfig', '{}'),
    R.omit(UNVALIDATED_PROPS),
    R.omit(TENANT_MEMBER_PROPS)
  )(mixedData);

  const partialTenantMemberData = R.compose(
    R.assoc('uuid', uuid()),
    R.assoc('cloudUserUuid', _cloudUserData.uuid),
    R.pick(TENANT_MEMBER_PROPS)
  )(mixedData);

  validateCloudUserData(R.defaultTo({}, _cloudUserData));

  const cloudUserData = decorateCloudUserDataForDbInsertion(_cloudUserData);

  DB.beginTransaction()
    .then(createCloudUser(cloudUserData))
    .then(prepTenantMemberDataForTransaction(partialTenantMemberData))
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

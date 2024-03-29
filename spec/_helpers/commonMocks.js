'use strict';

const R       = require('ramda'),
      dbUtils = require('@aliencreations/node-mysql-connector')(null);

const { error, errors } = require('@aliencreations/node-error');

const APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY        = 6002,
      APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT = 6999;

const COMMON_TIMESTAMP = new Date('2016-02-01T17:23:30.000Z');
const COMMON_UUID = '32ff6452-a0f8-45a7-b476-c2f245e27043';

const transformDbColsToJsProps = dbUtils.transformQueryResponse;

const COMMON_REQUEST_BODY = {
  flash   : R.identity,
  session : {
    flash : {}
  }
};

const COMMON_EMPTY_REQUEST_ERROR = new TypeError('Cannot set property "flash" of undefined');

const COMMON_RESPONSE_BODY = {
  locals : {},
  set    : () => COMMON_RESPONSE_BODY,
  status : () => COMMON_RESPONSE_BODY,
  send   : R.identity,
  json   : R.identity
};

const COMMON_DB_UPDATE_OR_DELETE_RESPONSE = {
  affectedRows : 1,
  warningCount : 0,
  message      : '',
  changedRows  : 0
};

const COMMON_DB_NO_AFFECTED_ROWS_RESPONSE = {
  affectedRows : 0,
  warningCount : 0,
  message      : '',
  changedRows  : 0
};

const noResultsErr         = error(errors.db.NO_QUERY_RESULTS());
const duplicateRecordErr   = error(errors.db.DUPLICATE());
const isNoResultsErr       = R.eqProps('code', errors.db.NO_QUERY_RESULTS());
const isDuplicateRecordErr = R.eqProps('code', errors.db.DUPLICATE());

const illegalParamErr          = error(errors.validation.VALUE());
const missingParamErr          = error(errors.validation.REQUIRED());
const unsupportedParamErr      = error(errors.validation.UNSUPPORTED());
const illegalParamErrRegex     = new RegExp(errors.validation.VALUE().message);
const missingParamErrRegex     = new RegExp(errors.validation.REQUIRED().message);
const unsupportedParamErrRegex = new RegExp(errors.validation.UNSUPPORTED().message);
const isIllegalParamErr        = R.eqProps('code', errors.validation.VALUE());
const isMissingParamErr        = R.eqProps('code', errors.validation.REQUIRED());
const isUnsupportedParamErr    = R.eqProps('code', errors.validation.UNSUPPORTED());

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite primary key.
 *
 * @param {String} a The first field in the composite key
 * @param {String} b The second field in the composite key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrCompositePrimary = (a, b) => ({
  code       : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
  message    : 'ER_DUP_ENTRY: Duplicate entry \'' + a + '-' + b + '\' for key \'PRIMARY\'',
  statusCode : 501
});

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite index.
 *
 * @param fieldA
 * @param fieldB
 * @param key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrComposite = (fieldA, fieldB, key) => ({
  code       : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
  message    : 'ER_DUP_ENTRY: Duplicate entry \'' + fieldA + '-' + fieldB + '\' for key \'' + key + '\'',
  statusCode : 501
});

/**
 * Mock a `duplicate record` error normally returned from MySQL when attempting
 * to insert a row that shares a composite index.
 *
 * @param {Array} fields
 * @param key
 * @returns {{code: number, message: string}}
 */
const duplicateRecordErrCompositeN = (fields, key) => ({
  code       : APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
  message    : 'ER_DUP_ENTRY: Duplicate entry \'' + fields.join('-') + '\' for key \'' + key + '\'',
  statusCode : 501
});

/**
 * Mock a `foreign key constraint fails` error normally returned from MySQL when attempting
 * to insert a row that provides an unknown value for a foreign key.
 *
 * @param constraintName
 * @param localTable
 * @param localField
 * @param foreignTable
 * @param foreignField
 * @returns {{code: number, message: string}}
 */
const foreignKeyConstraintErr = (constraintName, localTable, localField, foreignTable, foreignField) => {
  // TODO Make the db name injectable here so if the spec isn't using coreDb it'll still work
  return {
    code       : APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT,
    message    : 'ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`' + process.env.CORE_DB_NAME + '`.`' + localTable + '`, CONSTRAINT `' + constraintName + '` FOREIGN KEY (`' + localField + '`) REFERENCES `' + foreignTable + '` (`' + foreignField + '`) ON DELETE CASCADE)',
    statusCode : 501
  };
};

/**
 * Return a new object that matches `originalObj` except with the new
 * key/val assignment provided by the overrides.
 *
 * @param {Object} originalObj The object used as the reference.
 * @param {String} overrideKey The property name we will be overriding.
 * @param {*}      overrideVal The new value
 * @returns {Object}
 */
const override = R.curry((originalObj, overrideKey, overrideVal) => {
  return R.mergeDeepRight(originalObj, R.objOf(overrideKey, overrideVal, {}));
});

const recursivelyOmitProps = R.curry((omittedPropsArr, v) => {
  if (!R.is(Object, v)) {
    return v;
  }
  if (!R.is(Array, v)) {
    v = R.omit(omittedPropsArr, v);
  }
  return R.map(recursivelyOmitProps(omittedPropsArr), v);
});

const _ensureTrueNullInCsvData = R.map(R.when(R.identical('NULL'), R.always(null)));
const ensureTrueNullInCsvData = R.ifElse(R.is(Array), R.map(_ensureTrueNullInCsvData), _ensureTrueNullInCsvData);

module.exports = {
  APPLICATION_ERROR_CODE_DB_DUPLICATE_ENTRY,
  APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT,
  transformDbColsToJsProps,
  override,
  recursivelyOmitProps,
  ensureTrueNullInCsvData,
  COMMON_TIMESTAMP,
  COMMON_UUID,
  COMMON_REQUEST_BODY,
  COMMON_EMPTY_REQUEST_ERROR,
  COMMON_RESPONSE_BODY,
  COMMON_DB_UPDATE_OR_DELETE_RESPONSE,
  COMMON_DB_NO_AFFECTED_ROWS_RESPONSE,
  illegalParamErr,
  missingParamErr,
  unsupportedParamErr,
  illegalParamErrRegex,
  missingParamErrRegex,
  unsupportedParamErrRegex,
  isIllegalParamErr,
  isMissingParamErr,
  isUnsupportedParamErr,
  noResultsErr,
  duplicateRecordErr,
  isDuplicateRecordErr,
  isNoResultsErr,
  duplicateRecordErrCompositePrimary,
  duplicateRecordErrComposite,
  duplicateRecordErrCompositeN,
  foreignKeyConstraintErr
};

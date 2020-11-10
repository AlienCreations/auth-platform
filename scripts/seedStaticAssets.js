'use strict';
/* eslint-disable no-console */

const R        = require('ramda'),
      path     = require('path'),
      config   = require('config'),
      throttle = require('promise-parallel-throttle'),
      nodeDir  = require('node-dir'),
      mime     = require('mime-types');

const addType = o => R.assoc('type', mime.lookup(R.takeLast(3, o.path)))(o);

module.exports = dir => {
  try {

    const StaticAssets = require('../server/core/services/staticAssets/StaticAssets');

    const rootDir    = path.resolve(__dirname, `../${dir}`);
    const keepSource = true;

    const trySavingFile = file => StaticAssets(config.staticAssets.strategy).saveFile(R.tail(R.replace(rootDir, '', file.path)), file, keepSource)
      .then(console.log)
      .catch(() => {
        console.log(`${R.compose(R.last, R.split('/'))(file)} failed, trying again`);
        return trySavingFile(file);
      });

    const parseAndSaveFile = R.compose(
      trySavingFile,
      addType,
      R.objOf('path'),
      R.partial(path.resolve, [__dirname]),
      R.concat('../')
    );

    return nodeDir.promiseFiles(dir).then(R.compose(
      queue => throttle.all(queue, { maxInProgress : 1 }),
      R.map(file => async () => await parseAndSaveFile(file))
    )).catch(Promise.reject);

  } catch (err) {
    return Promise.reject(err);
  }

};

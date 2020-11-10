'use strict';

const fs   = require('fs'),
      path = require('path');

const app = require('../server/core/core');

const TENANT_ACCESS_RESOURCES_CSV_PATH = path.resolve(__dirname, `../sql/loadFiles/env/${process.env.NODE_ENV}/coreDb/tenantAccessResources.csv`);

try {
  fs.unlinkSync(TENANT_ACCESS_RESOURCES_CSV_PATH);
} catch(e) {
  // No file deletion necessary
}

fs.appendFileSync(
  TENANT_ACCESS_RESOURCES_CSV_PATH,
  'id,title,key,uri,method,status\n'
);

fs.appendFileSync(
  TENANT_ACCESS_RESOURCES_CSV_PATH,
  '1,All Resources and Methods,all-resources,*,*,1\n'
);

let index = 2;
let lastEntry = '';

// Hacky code taken from here : https://github.com/expressjs/express/issues/3308
function makeRow (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(makeRow.bind(null, path.concat(split(layer.route.path))));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(makeRow.bind(null, path.concat(split(layer.regexp))));
  } else if (layer.method) {

    const endPoint = path.concat(split(layer.regexp)).filter(Boolean).join('/'),
          method   = layer.method.toUpperCase();

    if (endPoint.slice(0, 3) === 'api' && (method + ' ' + endPoint) !== lastEntry) {
      fs.appendFileSync(
        TENANT_ACCESS_RESOURCES_CSV_PATH,
        [
          index,
          `title-${index}`,
          `key-${index}`,
          '/' + endPoint,
          method,
          1
        ].join(',') + '\n'
      );

      index += 1;
      lastEntry =  method + ' ' + endPoint;
    }

  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/');
  } else if (thing.fast_slash) {
    return '';
  } else {
    let match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
    return match ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>';
  }
}

const run = ({ resolve }) => {
  app._router.stack.forEach(makeRow.bind(null, []));
  resolve();
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    run({ resolve, reject });
  });
};



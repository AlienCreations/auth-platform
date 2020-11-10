#!/usr/bin/env bash

node << EOF
  require('events').EventEmitter.prototype._maxListeners = 500;
  require('./server/platform.js');
EOF

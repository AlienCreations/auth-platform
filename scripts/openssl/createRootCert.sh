#!/usr/bin/env bash
openssl req -x509 -new -nodes -key ${1}.key -sha256 -days 3650 -out ${1}.pem << EOF
.
.
.
.
.
${1}-root
.
EOF

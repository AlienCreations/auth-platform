#!/usr/bin/env bash
openssl req -new -key ${1}.key -out ${1}.csr << EOF
.
.
.
.
.
${1}
.
.
EOF

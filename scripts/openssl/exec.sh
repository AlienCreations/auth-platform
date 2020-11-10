#!/usr/bin/env bash

ROOT_KEY_NAME=$1
HOST_NAME=$2

# DO NOT CHANGE ANY OF THIS!
source ./scripts/openssl/createRootPrivateKey.sh ${ROOT_KEY_NAME}
source ./scripts/openssl/createRootCert.sh ${ROOT_KEY_NAME}
source ./scripts/openssl/createPrivateKey.sh ${HOST_NAME}
source ./scripts/openssl/createCsr.sh ${HOST_NAME}
source ./scripts/openssl/createSignedCert.sh ${ROOT_KEY_NAME} ${HOST_NAME}

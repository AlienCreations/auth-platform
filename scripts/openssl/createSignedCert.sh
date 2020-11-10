#!/usr/bin/env bash
cat > openssl.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.${2}
DNS.2 = ${2}
EOF

openssl x509 -req -in ${2}.csr -CA ${1}.pem -CAkey ${1}.key -CAcreateserial \
-out ${2}.crt -days 1825 -sha256 -extfile openssl.ext

rm openssl.ext

echo "Copy the pem file to the client side, and add use like this in the package.json for webpack dev:"
echo " \"demo\": \"export HOST=www.${2} && cp ./${1}.pem ./node_modules/webpack-dev-server/ssl/server.pem && react-scripts start\","

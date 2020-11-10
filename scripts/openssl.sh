#!/usr/bin/env bash
cat > openssl.cnf <<-EOF
  [req]
    distinguished_name = req_distinguished_name
    x509_extensions = v3_req
    prompt = no
  [req_distinguished_name]
    CN = *.gymlens.test
  [v3_req]
    keyUsage = keyEncipherment, dataEncipherment
    extendedKeyUsage = serverAuth
    subjectAltName = @alt_names
  [alt_names]
    DNS.1 = *.gymlens.test
    DNS.2 = gymlens.test
EOF

openssl req \
  -new \
  -newkey rsa:2048 \
  -sha1 \
  -days 3650 \
  -nodes \
  -x509 \
  -keyout ssl.key \
  -out ssl.crt \
  -config openssl.cnf

rm openssl.cnf

cat ssl.crt ssl.key > ssl.pem

# Copy the pem file to the client side, and add use like this in the package.json for webpack dev:
# "demo": "export HOST=www.gymlens.test && cp ./ssl.pem ./node_modules/webpack-dev-server/ssl/server.pem && react-scripts start",

# OpenSSL scripts for creating a CA and signing SSL certs

Execute this all as one series of instructions. Pick a root key password and use it for all prompts. 
For development, just use `root`

Example usage (params are ROOT_KEY_NAME, HOST_NAME): 
```bash 
bash ./scripts/openssl/exec.sh ac auth-platform.test
```


../bin/rhq-cli.sh -u rhqadmin -p rhqadmin -s localhost -t 7080 << EOF
exec -f scripts/paas.js
exec -f scripts/remove-resource.js --args-style=indexed $1
quit
EOF

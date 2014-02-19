$JON_CLI_HOME/bin/rhq-cli.sh -u rhqadmin -p rhqadmin -s localhost -t 7080 << EOF
exec -f $JON_SCRIPT_HOME/paas.js
exec -f $JON_SCRIPT_HOME/create-static-linux-group.js $1
quit
EOF

$JON_CLI_HOME/bin/rhq-cli.sh -u rhqadmin -p rhqadmin -s localhost -t 7080 << EOF
exec -f $JON_SCRIPT_HOME/paas.js
exec -f $JON_SCRIPT_HOME/deploy-new-jboss-profile.js $1 $2 $3 $4 $5
quit
EOF

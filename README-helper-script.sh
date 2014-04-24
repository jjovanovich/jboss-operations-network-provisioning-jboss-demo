export GIT_REPO_DIR=/git/jboss-operations-network-provisioning-jboss-demo

---------------------------- Set up JON provisioning ----------------------
# ssh on the machine this script has been stored to
export JON_AGENT_MACHINE_NAME=localhost
export JON_CLI_HOME=/app/jon/rhq-remoting-cli-4.9.0.JON320GA
#export RHQ_CLI_JAVA_HOME=/etc/alternatives/java_sdk_1.7.0_openjdk/
export RHQ_CLI_JAVA_HOME=/etc/alternatives/java_sdk_1.6.0/

export RHQ_CLI_JAVA_OPTS="-Xms64m -Xmx512m -Djava.net.preferIPv4Stack=true"
export JON_SCRIPT_HOME=$GIT_REPO_DIR/scripting
export JON_BUNDLE_HOME=$GIT_REPO_DIR/bundles

## for testing purposes only (interactive JON CLI)
## $JON_CLI_HOME/bin/rhq-cli.sh -u rhqadmin -p rhqadmin -s localhost -t 7080
## exec -f $GIT_REPO_DIR/paas.js
## exec -f $GIT_REPO_DIR/myscript.js $1 $2

cd $GIT_REPO_DIR/bundles
# remove old bundle(s) via ant
ant clean
# rebuild new JON bundle(s) via ant
ant

cd $GIT_REPO_DIR/scripting

### create JBoss instance bundle (if it already exists : change version number in $GIT_REPO_DIR/bundles/src/EAP/6.1.0/jboss-profile/deploy.xml accordingly)
./create-bundle.sh "$JON_BUNDLE_HOME/dist/EAP-6.2.0-jboss-profile.zip" "EAP-6.2.0-jboss-profile"

./create-bundle.sh "$JON_BUNDLE_HOME/dist/application-deployment-EAP6.zip" "application-deployment-EAP6"
./deploy-application.sh "/tmp/temp2" "/app/jboss-eap-instances-created-by-jon/" "dev1-eap6-03" "guess-1.0" "static-group-localhost"

#---------- JON GUI
#Check if the new linux machine (and it's JON agent) appears in the Discovery Queue, if so import the 'RHQ agent'

#---------- The next steps are no direct JBoss servers operations (we are setting up the environment) ---------- #

# Importing Apache server into JON inventory (Apache already exists as created by infrastructure team)
./add-all-auto-discovered-apache-on-specific-machine-to-jon-inventory.sh "$JON_AGENT_MACHINE_NAME"

# Create slot manager script server on a specific machine (adds the slot manager to JON --> does not create the file on remote machine)
./create-slot-manager-script-server.sh "$JON_AGENT_MACHINE_NAME"

# Check if another slot is available on a machine
./execute-slot-manager-scriptserver.sh "$JON_AGENT_MACHINE_NAME" "get-all-free-slots"

# Create new JON group (JBoss bundles can only be deployed into groups)
./create-static-linux-group.sh "static-group-$JON_AGENT_MACHINE_NAME"
#./delete-group.sh "static-group-$JON_AGENT_MACHINE_NAME"

# Add linux machine to created group
./add-linux-instance-to-group.sh "$JON_AGENT_MACHINE_NAME" "static-group-$JON_AGENT_MACHINE_NAME"

#------------ Here we start to deploy new JBoss servers (this will be executed by the JON agents)  --------- #

# TODO when having the same name "dev1-eap6-01" on two different machines / groups --> PROBLEM !!!

# if there are multiple versions of the bundle "eap-6.1.0_jboss-profile" --> the latest is chosen (chosen via the alphanumeric name of the version!!!!)
./create-new-jboss-profile-full-automatic.sh "dev1-poc1-01"  "clusterEnabled" "eap-6.2.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"
#(adapt line "// TODO : implement JBoss switcher" in $JON_SCRIPT_HOME/paas.js)
./create-new-jboss-profile-full-automatic.sh "dev1-jdg6-01"  "clusterEnabled" "jdg-6.2.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"


# create-new-jboss-profile-full-automatic.sh replaces the 2 following lines (no pw needs to be 'invented')
# ./deploy-new-jboss-profile.sh "dev1-eap6-01" "dev1-poc1" "admin-123" "eap-6.1.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"
# ./add-auto-discovered-jboss-on-specific-machine-to-jon-inventory.sh "$JON_AGENT_MACHINE_NAME" "dev1-eap6-01" "admin-123"
 

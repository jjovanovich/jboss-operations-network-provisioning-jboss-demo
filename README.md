jboss-operations-network-provisioning-jboss-demo
================================================

Scripting toolset to set up JBoss EAP 6 provioning with JBoss Operations Network


Add
visudo
add line (let's you execute the script /files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6)
<your-linux-user>  ALL=(ALL)       NOPASSWD:ALL

---
Prepare files on JON agent system
cp <git-clone>/files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6 /etc/init.d/jboss-eap6
chmod 777 /etc/init.d/jboss-eap6  (this is important)

cd /app/middleware/jboss-eap-instances-created-by-jon
mkdir usrjbs01
mkdir usrjbs02
mkdir usrjbs03

cp *.sh into your ~/bin directory (JON will execute those files)

---

hard coded :
/app/middleware/jboss-eap-instances-created-by-jon (jboss-slot-manager.sh & paas.js)
/home/roland/bin/ (paas.js)
/app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0/ (paas.js)
"roland",  (paas.js)


JBOSS_HOME=/app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0
JBOSS_INSTANCE_HOME=/app/middleware/jboss-eap-instances-created-by-jon
(/home/roland/bin/admin-user-manager.sh)
--> echo -n "admin:ManagementRealm:admin-123" | openssl md5 | awk '{print $2}'


/etc/init.d/jboss-eap6 (
line ~ 36 adapt :
MCAST_ADDR=234.99.54.14
JBINSTANCES=/app/middleware/jboss-eap-instances-created-by-jon
line ~ 88 adapt :
JBOSS_USER=roland


)



---
export GIT_REPO_DIR=/data/git-repos/presales-demo-jon


---------------------------- Set up JON provisioning ----------------------
# ssh on the machine this script has been stored to
export JON_AGENT_MACHINE_NAME=roland.cdg.redhat.com
export JON_CLI_HOME=/app/middleware/jon-server/jon-server-3.2.0/rhq-remoting-cli-4.9.0.JON320GA
export RHQ_CLI_JAVA_HOME=/etc/alternatives/java_sdk_1.7.0_openjdk/
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
./create-bundle.sh "$JON_BUNDLE_HOME/dist/EAP-6.1.0-jboss-profile.zip" "EAP-6.1.0-jboss-profile"
./create-bundle.sh "$JON_BUNDLE_HOME/dist/JDG-6.2.0-jboss-profile.zip" "JDG-6.2.0-jboss-profile"


#---------- JON GUI
Check if the new linux machine (and it's JON agent) appears in the Discovery Queue, if so import the 'RHQ agent'

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
./create-new-jboss-profile-full-automatic.sh "dev1-eap6-01"  "clusterEnabled" "eap-6.1.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"
(adapt line "// TODO : implement JBoss switcher" in $JON_SCRIPT_HOME/paas.js)
./create-new-jboss-profile-full-automatic.sh "dev1-jdg6-01"  "clusterEnabled" "jdg-6.2.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"


# create-new-jboss-profile-full-automatic.sh replaces the 2 following lines (no pw needs to be 'invented')
# ./deploy-new-jboss-profile.sh "dev1-eap6-01" "dev1-poc1" "admin-123" "eap-6.1.0_jboss-profile" "static-group-$JON_AGENT_MACHINE_NAME"
# ./add-auto-discovered-jboss-on-specific-machine-to-jon-inventory.sh "$JON_AGENT_MACHINE_NAME" "dev1-eap6-01" "admin-123"


---------
Check out that your JBoss have started and registered to Apache and mod_cluster
Check out Apache mod_cluster-manager
http://localhost:10001/mcm
Check out JON GUI :
http://localhost:7080/coregui/

optional :
./standalone.sh -c standalone.xml -b 127.0.0.1 -bmanagement=127.0.0.1 -Djboss.node.name=eap-1 -Djboss.socket.binding.port-offset=1000 -Djboss.server.base.dir=../standalone-jdg-visualizer -Djdg.visualizer.jmxUser=admin -Djdg.visualizer.jmxPass=admin-1 -Djdg.visualizer.serverList=localhost:11422
check all nodes
http://localhost:9080/jdg-visualizer/

./standalone.sh -c standalone.xml -b 127.0.0.1 -bmanagement=127.0.0.1 -Djboss.node.name=eap-1 -Djboss.socket.binding.port-offset=1000 -Djboss.server.base.dir=../standalone-jdg-visualizer -Djdg.visualizer.jmxUser=admin -Djdg.visualizer.jmxPass=admin-1 -Djdg.visualizer.serverList=localhost:11422

have a look into folder :
/app/middleware/jboss-eap-instances-created-by-jon/
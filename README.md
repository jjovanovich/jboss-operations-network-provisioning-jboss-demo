jboss-operations-network-provisioning-jboss-demo
================================================
Scripting toolset to set up JBoss EAP 6 provioning with JBoss Operations Network

# Prerequisits
- Use a init.d based OS (Fedora, RHEL, ...)
- JON 3.2.0 instance running on your machines
- JBoss EAP 6.1.0 engine
- JBoss JDG 6.2.0 engine
- Apache with mod_cluster installed (optional)

# Machine setup

## JBoss instance setup
- Create multiple directories into which JON will deploy JBoss instances (limit the open slots by creating usrjbsXY )

mkdir /app/middleware/jboss-eap-instances-created-by-jon
cd /app/middleware/jboss-eap-instances-created-by-jon
mkdir usrjbs01
mkdir usrjbs02
mkdir usrjbs03

- Here 3 slots will be available

## Prepare files on JON agent machine (this is most probably the same )
- The init script that will be used by JON to start and stop the instances
cp <git-clone>/files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6 /etc/init.d/jboss-eap6
chmod 777 /etc/init.d/jboss-eap6  (this is important)

- Adapt file /etc/init.d/jboss-eap6
at line ~ 36 adapt JBINSTANCES directory created previously:
JBINSTANCES=/app/middleware/jboss-eap-instances-created-by-jon

at line ~ 88 adapt the JBOSS_USER to the user that executes the JBoss instances:
JBOSS_USER=roland

## Create a bin directory on the JON agent machine

cp <git-clone>/files-needed-on-jon-agent-machines/bin/admin-user-manager.sh ~/bin
cp <git-clone>/files-needed-on-jon-agent-machines/bin/jboss-slot-manager.sh ~/bin
chmod +x ~/bin

- JON will execute those files

## Add your Linux user to sudoers
visudo
- add line (let's you execute the script /files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6)
<your-linux-user>  ALL=(ALL)       NOPASSWD:ALL


# Change hardcoded values (TODO)

hard coded :
/app/middleware/jboss-eap-instances-created-by-jon (jboss-slot-manager.sh & paas.js)
/home/roland/bin/ (paas.js)
/app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0/ (paas.js)
"roland",  (paas.js)

- In file ~/bin/admin-user-manager.sh
JBOSS_INSTANCE_HOME=/app/middleware/jboss-eap-instances-created-by-jon

# Switch over to script	README-helper-script.sh !!!

# Access URLs
have a look into folder :
/app/middleware/jboss-eap-instances-created-by-jon/

Check out that your JBoss have started and registered to Apache and mod_cluster (via mod_cluster-manager)
http://localhost:10001/mcm

Check out JON GUI :
http://localhost:7080/coregui/

optional :
./standalone.sh -c standalone.xml -b 127.0.0.1 -bmanagement=127.0.0.1 -Djboss.node.name=eap-1 -Djboss.socket.binding.port-offset=1000 -Djboss.server.base.dir=../standalone-jdg-visualizer -Djdg.visualizer.jmxUser=admin -Djdg.visualizer.jmxPass=admin-1 -Djdg.visualizer.serverList=localhost:11422
check all nodes
http://localhost:9080/jdg-visualizer/

./standalone.sh -c standalone.xml -b 127.0.0.1 -bmanagement=127.0.0.1 -Djboss.node.name=eap-1 -Djboss.socket.binding.port-offset=1000 -Djboss.server.base.dir=../standalone-jdg-visualizer -Djdg.visualizer.jmxUser=admin -Djdg.visualizer.jmxPass=admin-1 -Djdg.visualizer.serverList=localhost:11422

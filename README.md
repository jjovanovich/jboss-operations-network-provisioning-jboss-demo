jboss-operations-network-provisioning-jboss-demo
================================================
Scripting toolset to set up JBoss EAP 6 provioning with JBoss Operations Network

# H1 Prerequisits
- JON 3.2.0 instance running on your machines
- JBoss EAP 6.1.0 engine
- JBoss JDG 6.2.0 engine

# H1 Machine setup

# H2 Repository setup

mkdir /app/middleware/jboss-eap-instances-created-by-jon
mkdir usrjbs01
mkdir usrjbs02
mkdir usrjbs03


visudo
add line (let's you execute the script /files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6)
<your-linux-user>  ALL=(ALL)       NOPASSWD:ALL

---
Prepare files on JON agent system
cp <git-clone>/files-needed-on-jon-agent-machines/etc/init.d/jboss-eap6 /etc/init.d/jboss-eap6
chmod 777 /etc/init.d/jboss-eap6  (this is important)


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
# admin-user-manager.sh <slot> <username> <password>

slot=$1
username=$2
password=$3
# The Realm (defined in standalone.xml), by default ManagementRealm
realm=ManagementRealm

JBOSS_HOME=/app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0
JBOSS_INSTANCE_HOME=/app/middleware/jboss-eap-instances-created-by-jon

# The UsernamePasswordHashUtil function takes 3 parameters : username realm passwordi
javaEncodedResult=$(java -cp $JBOSS_HOME/bin/client/jboss-client.jar org.jboss.sasl.util.UsernamePasswordHashUtil $username $realm $password 2>&1)
# strips off last column and removes whitespaces
encodedPasswordLine=$(echo $javaEncodedResult | awk -F: '{print $NF}' | tr -d ' ')
echo $encodedPasswordLine
echo -e "\n$encodedPasswordLine" >> $JBOSS_INSTANCE_HOME/$slot/configuration/mgmt-users.properties

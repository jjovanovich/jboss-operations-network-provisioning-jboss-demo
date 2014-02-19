# admin-user-manager.sh <slot> <username> <password>

slot=$1
username=$2
password=$3
# The Realm (defined in standalone.xml), by default ManagementRealm
realm=ManagementRealm

JBOSS_INSTANCE_HOME=/app/middleware/jboss-eap-instances-created-by-jon

encodedPassword=$(echo -n "$username:$realm:$password" | openssl md5 | awk '{print $2}')
encodedPasswordLine=$(echo "$username=$encodedPassword")
echo -e "\n$encodedPasswordLine" >> $JBOSS_INSTANCE_HOME/$slot/configuration/mgmt-users.properties

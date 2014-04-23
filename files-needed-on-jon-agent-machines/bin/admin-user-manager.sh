# admin-user-manager.sh <slot> <username> <password>


# loading variables JBINSTANCES
. /etc/jboss-config

slot=$1
username=$2
password=$3
# The Realm (defined in standalone.xml), by default ManagementRealm
realm=ManagementRealm

encodedPassword=$(echo -n "$username:$realm:$password" | openssl md5 | awk '{print $2}')
encodedPasswordLine=$(echo "$username=$encodedPassword")
echo -e "\n$encodedPasswordLine" >> $JBINSTANCES/$slot/configuration/mgmt-users.properties

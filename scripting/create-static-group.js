var groupName = args[0];
var groupType = args[1];

var resourceGroup = findGroup(groupName);

if( resourceGroup != null ) {
    deleteGroup(resourceGroup.getId());
}

  if (groupType == "eap6"){
    var resourceType = getJBossEAP6Type();
  }
	else {
		var resourceType = getLinuxType();
	}

createGroup(groupName, resourceType);



var groupName = args[0];

var resourceGroup = findGroup(groupName);

if( resourceGroup != null ) {
    deleteGroup(resourceGroup.getId());
}

var resourceType = getLinuxType();
createGroup(groupName, resourceType);

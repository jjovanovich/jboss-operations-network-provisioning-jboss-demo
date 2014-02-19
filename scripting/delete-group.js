var groupName = args[0];
var pluginName = "JBossAS5";
var typeName = "JBossAS Server";

var resourceGroup = findGroup(groupName);

if( resourceGroup != null ) {
    deleteGroup(resourceGroup.getId());
}

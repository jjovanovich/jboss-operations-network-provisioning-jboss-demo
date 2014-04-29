var machineName = args[0].replace("_"," ");
var jbossInstanceName = args[1].replace("_"," ");
var groupName = args[2].replace("_"," ");

addJbossToGroup(machineName, jbossInstanceName, groupName);
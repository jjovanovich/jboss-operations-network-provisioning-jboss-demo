var destination = args[0];
var jbossInstanceHome = args[1];
var jbossProfiles = args[2].replace("_"," ");
var bundleName = args[3].replace("_"," ");
var groupName = args[4].replace("_"," ");

deployApplication(destination, jbossInstanceHome, jbossProfiles, bundleName, groupName);

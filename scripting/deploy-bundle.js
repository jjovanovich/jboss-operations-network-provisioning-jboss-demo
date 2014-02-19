var bundleName = args[0];
var groupName = args[1];
var destinationName = args[2].replace("_"," ");
var destinationDesc = args[3].replace("_"," ");
var destinationType = args[4].replace("_"," ");
var destinationLocation = args[5];
var bundleVersionUsr = args[6];
var deploymentDesc = args[7].replace("_"," ");

deployBundle(bundleName, groupName, destinationName, destinationDesc, destinationType, destinationLocation, bundleVersionUsr, deploymentDesc);

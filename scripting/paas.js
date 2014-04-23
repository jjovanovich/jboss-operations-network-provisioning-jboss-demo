/*===============================================================================
 *    Utility functions for PaaS (Plaform as a Service) using JON-CLI (rhq-cli.sh)
 *    JON (JBoss Operations Network by Red Hat)

 *    Copyright Roland Brackmann <roland.brackmann@redhat.com>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *===============================================================================*/


/***********************************************************************************/
/* UTILITY FUNCTIONS WITH HARD CODED VALUES                                        */
/***********************************************************************************/

function getLinuxType() {
	var linuxType = ResourceTypeManager.getResourceTypeByNameAndPlugin("Linux", "Platforms");
	return linuxType;
}

function getJBossEAP6Type() {
	var jbossType = ResourceTypeManager.getResourceTypeByNameAndPlugin("JBossAS7 Standalone Server", "JBossAS7");
	return jbossType;
}

function getApacheType() {
	var apacheType = ResourceTypeManager.getResourceTypeByNameAndPlugin("Apache HTTP Server", "Apache");
	return apacheType;
}

function getScriptServerType() {
    var scriptServerType = ResourceTypeManager.getResourceTypeByNameAndPlugin("Script Server", "Script");
    return scriptServerType;
}

function getApacheKey() {
	return "/etc/httpd||/etc/httpd/conf/httpd.conf";
}

function getMillisecondsToSleepAfterJonDiscovery() {
	return "15000";
}

function getJBossStartScriptArgs() {
	return "start";
}

// e.g. jonadmin
function getJBossUserUsedByJON() {
	return "jboss";
}

// e.g. /srv/jboss/tools/jboss-slot-manager.sh
function getJbossSlotManagerScript() {
	return "/home/jboss/bin/jboss-slot-manager.sh";
}

/**
 * @return the standard directory of the JBoss vault directory
 */
function getJbossVaultHomeDir(jbossInstanceName)
{
	var jbossVaultHomeDir = "/app/jboss-eap-instances-created-by-jon/" + jbossInstanceName + "/vault/data";
	return jbossVaultHomeDir;
}

/**
 * @return the standard directory of the JBoss instances
 */
function getJbossInstancesHomeDir()
{
	return "/app/jboss-eap-instances-created-by-jon";
}

/**
 * @return the standard directory of the JBoss start script
 */
function getJBossStartScriptURL(jbossInstanceName)
{
	var jbossStartScript = "/app/jboss-eap-instances-created-by-jon/" + jbossInstanceName + "/jon-script-jboss-eap6.sh";
	return jbossStartScript;
}

/**
 * @return the directory of the JBoss engine
 */
function getJbossEngineHomeDir()
{
// TODO : implement JBoss switcher

	// for EAP6.1
//	return "/app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0";

	// for JDG6.2
//	return "/app/middleware/jboss-datagrid-6.2.0/jboss-datagrid-6.2.0-server";
	
	return "/app/jboss";
	
}

/**
 * @return the directory of the JBoss logs
 */
function getJbossLogHomeDir()
{
	return "/app/middleware/jboss-eap-instances-created-by-jon/logs/jboss";
}

/**
 * @return the directory of the JBoss data (input / output data for application data)
 */
function getJbossDataHomeDir()
{
	return "/app/middleware/jboss-eap-instances-created-by-jon/data/jboss";
}

/**
 * @return the full name (including path) of the jboss-slot-manager.sh script
 */
function getJbossToolsHomeDir()
{
	return "/home/roland/bin/";
}

/**
 * @return the Realm that handles the HTTP request authentication
 * the name "ManagementRealm" should not be changed as the JON EAP plugin has this name hardcoded
 */
function getJbossManagementRealm()
{
	return "ManagementRealm";
}

/**
 * @return the multicast address of all JBoss servers
 * @deprecated THIS IS STILL HERE AND DEPLOYED, BUT NEVER USED, as jboss-eap6.conf will override this value!
 * @TODO to be deleted (also from JON bundle)
 */
function getJbossMultiCastAddress()
{
	return "239.0.0.25";
}

/**
 * @return the linux user that is used to deploy applications and may change passwords via the provided script within the JBoss instance
 *  the linux user that has the right to ssh into the machine and slot and execute a script in the vault directory
 */
function getJbossdeploymentLinuxuser()
{
	return "roland";
}

/***********************************************************************************/
/* UTILITY FUNCTIONS WITHOUT HARD CODED VALUES                                     */
/***********************************************************************************/

/**
 * @generates a 20 digit randam password
 */
function getGeneratedRandomPassword() {
	var generatedRandomPassword = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 20; i++ )
        	generatedRandomPassword += possible.charAt(Math.floor(Math.random() * possible.length));
	return generatedRandomPassword + "-";
}

/**
 * Reads a file into a byte-array
 *
 * @param fileName Name of the file
 */
function readFile(fileName){
  var inputStream = new java.io.FileInputStream(new java.io.File(urlName));
  var outputStream = new java.io.ByteArrayOutputStream();
  var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8092);
  var n = 0;

  while ((n = inputStream.read(bytes)) > 0){
    outputStream.write(bytes,0,n);
  }

  return outputStream.toByteArray();
}

/**
 * Gets the last object of a specifique bundle object
 *
 * @param the bundle object
 * @return the last existing version of a bundle
 */
function getLastBundleVersion(bundle) {
	var criteria  = new BundleVersionCriteria() ;
	criteria.addFilterBundleId(bundle.id) ;
	var pc=new PageControl();
	pc.setPrimarySort("versionOrder",PageOrdering.DESC);
	criteria.setPageControl(pc);
	var versions=BundleManager.findBundleVersionsByCriteria(criteria) ;
	var version=versions.get(0) ;
	return version;
}

/**
 * get destination (creates it if it does not exist)
 * in the GUI : this is the first page when deploying a bundle
 */
function getDestination(aDestinationName, aBundle, aGroup, aDeployDir) {
	
	var criteria = new BundleDestinationCriteria();
	criteria.strict=true;
	criteria.addFilterName(aDestinationName);
	var destinations=BundleManager.findBundleDestinationsByCriteria(criteria);
	if (destinations.isEmpty()) {
		var criteria = new ResourceTypeCriteria();
		criteria.addFilterId(getLinuxType().id);
		criteria.fetchBundleConfiguration(true);
		var type=ResourceTypeManager.findResourceTypesByCriteria(criteria).get(0);
		var baseDir=type.getResourceTypeBundleConfiguration().getBundleDestinationBaseDirectories().toArray()[0].name;;
		println("the JON destination (JON managed, the file system destination might exist) " + aDestinationName + " does not exist. Creating it ...");
		return BundleManager.createBundleDestination(aBundle.id, aDestinationName, "", baseDir, aDeployDir, aGroup.id);
	}
	else {
		println("the destination " + aDestinationName + " exists");
		return destinations.get(0);
	}
}

/**
 * get a group by name (if it does not exist, create it)
 */
function getGroup(groupName, aType, description, createIfNotExist) {
	var criteria = new ResourceGroupCriteria();
	criteria.addFilterResourceTypeId(aType.id);
	criteria.addFilterName(groupName);
	criteria.fetchExplicitResources(true);
	criteria.strict=true;
	var resources = ResourceGroupManager.findResourceGroupsByCriteria(criteria);
	if( resources == null || resources.size() == 0) {
		if (createIfNotExist) {
			println("the group " + groupName + " does not exist, creating it now");
			var group = new ResourceGroup(groupName, aType);
			group.setDescription(description+ " created on " + new java.util.Date().toString());
			return ResourceGroupManager.createResourceGroup(group);
		}
		else {
			println("the group " + groupName + " does not exist");
			return null;
		}
	}
	else {
		var group = resources.get(0);
		println("the group " + groupName + " exists");
		return group;
	}
}

/**
 * Finds a group via it's name
 *
 * @param groupName The group's name
 * @return group if a group has been found, <code>null</code> otherwise
 */
function findGroup(groupName){
	var resourceGroupCriteria = new ResourceGroupCriteria;
	var group = null;
	
	resourceGroupCriteria.addFilterName(groupName);
	resourceGroupCriteria.fetchExplicitResources(false);
	
	var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(resourceGroupCriteria);
	
	if (resourceGroups != null && resourceGroups.size() > 0){
		group = resourceGroups.get(0);
	}  
	
	return group;
}

/**
 * Creates a group
 *
 * @param groupName    group-name
 * @param resourceType resource-type
 * @param description  description
 */
function createGroup(groupName, resourceType, description){
	var resourceGroup = new ResourceGroup(groupName, resourceType);
	
	resourceGroup.setRecursive(false);
	resourceGroup.setDescription(description);
	ResourceGroupManager.createResourceGroup(resourceGroup);
}

/**
 * Deletes a group
 *
 * @param groupId ID of the group
 *
 */
function deleteGroup(groupId){
	ResourceGroupManager.deleteResourceGroup(groupId);
}

/**
 * Creates a dynamic group TODO : does not work yet
 *
 * @param groupName   Name of the group
 * @param expression  Expression to use to form the group
 * @param description Description of the dynamic group
 */
function createDynamicGroup(groupName, resourceType, expression, description){
	var resourceGroup = new ResourceGroup(groupName, resourceType);
	resourceGroup.setDescription(description);
	var groupDefinition = new GroupDefinition();
	groupDefinition.setExpression(expression);
	resourceGroup.setGroupDefinition(groupDefinition);
	ResourceGroupManager.createResourceGroup(resourceGroup);
}

/**
* Adds a machine (OS) to a group
*
* @param machineName Name of the machine (OS)
* @param groupName              Name the group
*/
function addMachineToGroup(machineName, groupName)
{

  var os = getMachine(machineName);

  if (os == null){
    throw "Machine " + machineName + " was not found."
  }

  var group = findGroup(groupName);

  if (group == null){
    throw "Group \"" + groupName + "\" was not found."
  }

  ResourceGroupManager.addResourcesToGroup(group.getId(),[os.getId()]);
}

/**
 * Schedules an operation such as start,stop or restart on a Web-AppServer
 * TODO : this has to be reimplemented, as not used today
 *
 * @param webAppServerInstance The Web-AppServer instance
 * @param operationName        The name of the operation [start|stop|restart]
 */
function scheduleOperationOnWebAppServerInstance(webAppServerInstance, operationName)
{
	var history = null;
	
	if (webAppServerInstance == null){
		throw "WebAppServerInstance \"" + webAppServerInstanceName + "\" was not found.";
	}
	
	var availabilityBefore = webAppServerInstance.getCurrentAvailability();
	
	var conf = new Configuration;
	var schedule = OperationManager.scheduleResourceOperation(webAppServerInstance.getId(), operationName, 0, 0, 0, 0, conf, "Executing "+operationName+" on WebAppServer.");
	
	while (!webAppServerInstance.getCurrentAvailability().equals(availabilityBefore)) {
		java.lang.Thread.currentThread().sleep(5000);
	}
}

/**
* Creates a bundle.
*
* @param urlName       The URL
* @param bundleName    The name of the bundle
* @param bundleVersion The version of the bundle to be created
*
* @return bundle if version does not exist or bundleVersion is a higher version than the latest in the system
*/
function createBundle(urlName, bundleName, bundleVersion)
{
 var versionExists = false;

 // Look for the bundle
 var bundle = getBundle(bundleName);

 // If bundle exist check it's version. If version is higher than the latest one everything is fine
 if (bundle != null){
   var bundleVersions = bundle.getBundleVersions();
   var versionCount = bundleVersions.size();
                         
   if (versionCount > 0) {
       versionExists = bundleVersionExists(bundleName, bundleVersion);

       if (versionExists) {
         throw "Bundle with name \"" + bundleName + "\" and version " + bundleVersion + " already exists."
       }
       
       var versions = bundle.bundleVersions;
       var versionSize = versions.size()
       var latestVersion = versions.get(versionSize - 1).version;
                                 
       if(latestVersion > bundleVersion) {
          throw "Bundle with name \"" + bundleName + "\" already exists with a higher version ["+latestVersion+"]"
       }
    }
 }
 
 // Create the bundle when it doesn't exist yet or will be a newer version  
 if (bundle == null || !versionExists) {
   if (urlName.indexOf("http://") > -1) {
     bundle = BundleManager.createBundleVersionViaURL(new java.net.URL(urlName));  
   } else {
      bundle = BundleManager.createBundleVersionViaByteArray(readFile(urlName));
   }
 }

 return bundle;
}

/**
 * Returns a bundle by it's name
 *
 * @param bundleName The name of the bundle
 */
function getBundle(bundleName)
{
	var bundle = null;
	
	var criteria = new BundleCriteria();
	criteria.addFilterName(bundleName);
	criteria.fetchBundleVersions(true);
	
	bundleArray = BundleManager.findBundlesByCriteria(criteria);
	
	var bundleSize = bundleArray.totalSize;
	if (bundleSize >= 1) {
		bundle = bundleArray.get(bundleSize - 1);
	}
	
	return bundle;
}

/**
 * Checks if a bundle with the specified version exists
 *
 * @param bundleName    Name of the bundle
 * @param bundleVersion Version of the bundle to look for
 */
function bundleVersionExists(bundleName, bundleVersion)
{
	var versionExists = false;
	var bundle = getBundle(bundleName);
	
	if (bundle != null){
		var bundleVersions = bundle.getBundleVersions();
		var versionCount = bundleVersions.size();
		
		if (versionCount > 0) {
			for ( var i = 0; i < bundleVersions.size(); i++){
				var bundleVersionInSystem = bundleVersions.get(i).version;
				
				if (bundleVersionInSystem.equals(bundleVersion)) {
					versionExists = true;
					break;
				}
			}
		}
	}
	return versionExists;
}


/**
 * Run autodiscovery on a specific plateform
 *
 * @param machineName    Name of the Linux name used by JON
 */
function runAutodiscoveryOnPlatform(machineName)
{
	var os = getMachine(machineName);
	ProxyFactory.getResource(os.id).manualAutodiscovery(true);
}

/**
 * Import from the discovery queue
 *
 * @param ressourceType    The JON object representing a ressource group (e.g. "JBossAS7" or "Apache")
 * @param ressourceKey     The ressource-key (e.g. is the JBoss instance home directory "/app/middleware/jboss-eap-instances-created-by-jon/dev1-poc1-01")
 *                or the Apache string "/etc/httpd||/etc/httpd/conf/httpd.conf" )
 * @returns jbossInstance
 **/
function importResouceViaTypeAndKey(ressourceType, ressourceKey)
{
	var criteria = ResourceCriteria();
	criteria.addFilterInventoryStatus(InventoryStatus.NEW);
	criteria.addFilterResourceTypeId(ressourceType.id);
	var resources = ResourceManager.findResourcesByCriteria(criteria);
	var resourceIds = [];
	
	if (resources.size() > 0) {
		for (i = 0; i < resources.size(); i++) {
			jbossInstance = resources.get(i);
			
			//the resource key should be the the server-home-dir (as auto-discovered)
			if (jbossInstance.getResourceKey() == ressourceKey) {
				
				var resourceIds = [];
				resourceIds[0] =  jbossInstance.id;
				DiscoveryBoss.importResources(resourceIds);
				return jbossInstance;
			}
		}
	}
}

/**
 * Coming from
 * https://access.redhat.com/site/documentation/en-US/JBoss_Operations_Network/3.1/html/Admin_Managing_Resource_Configuration/drift-alerts-script.html
 * 
 * Tries to deploy given bundle version to provided destination using given configuration.
 * <p>
 * This method blocks while waiting for the deployment to complete or fail.
 *
 * @param destination the bundle destination (or id thereof)
 * @param bundleVersion the bundle version to deploy (or id thereof)
 * @param deploymentConfiguration the deployment configuration.
 * @param description the deployment description
 * @param isCleanDeployment if true, perform a wipe of the deploy directory prior to the deployment; if false,
 * perform as an upgrade to the existing deployment, if any
 *
 * @return the BundleDeployment instance describing the deployment
 **/
function deployBundle(destination, bundleVersion, deploymentConfiguration, description, isCleanDeployment) {
	var destinationId = destination;
	if (typeof(destination) == 'object') {
		destinationId = destination.id;
	}
	
	var bundleVersionId = bundleVersion;
	if (typeof(bundleVersion) == 'object') {
		bundleVersionId = bundleVersion.id;
	}
	
	var deploymentConfig = deploymentConfiguration;
	if (!(deploymentConfiguration instanceof Configuration)) {
		deploymentConfig = asConfiguration(deploymentConfiguration);
	}
	
	var deployment = BundleManager.createBundleDeployment(bundleVersionId, destinationId, description, deploymentConfig);
	
	deployment = BundleManager.scheduleBundleDeployment(deployment.id, isCleanDeployment);
	
	var crit = new BundleDeploymentCriteria;
	crit.addFilterId(deployment.id);
	
	while (deployment.status == BundleDeploymentStatus.PENDING || deployment.status == BundleDeploymentStatus.IN_PROGRESS) {
		java.lang.Thread.currentThread().sleep(1000);
		var dps = BundleManager.findBundleDeploymentsByCriteria(crit);
		if (dps.empty) {
			throw "The deployment disappeared while we were waiting for it to complete.";
		}	
		deployment = dps.get(0);
	}
	return deployment;
}

/**
 * set up a JBoss EAP profile
 * @param jbossInstanceName - e.g. "dev1-poc1-01"
 * @param jbossAdminPassword - e.g. "password1"
 * @param bundleName - e.g. "eap-6.1.0_jboss-profile"
 * @param groupName - e.g. "static-group-linux-boxes"
 * @param serviceLevel - e.g. "bronze", "silver", "gold" or "custom" (TODO)
 *
 * e.g deployNewJBossProfile("dev1-poc1-01", "dev1-poc1", "admin-123", "eap-6.1.0_jboss-profile" , "static-group-linux-boxes", "bronze"(TODO))
 */
function deployNewJBossProfile(jbossInstanceName, jbossClusterNamePrefix, jbossAdminPassword, bundleName, groupName)
{
	// get the bundle object
	var bundle = getBundle(bundleName);
	var linuxMachineGroup = getGroup(groupName, getLinuxType(), "nothing" , false);
	
	// e.g. /srv/jboss/jboss-eap-instances
	var jbossInstancesHomeDir = getJbossInstancesHomeDir();
	
	// e.g. /app/middleware/jboss-eap-instances-created-by-jon/dev1-poc1-01
	var jbossInstanceDir = jbossInstancesHomeDir + "/" + jbossInstanceName;
	
	// e.g. /app/middleware/jboss-eap-6.1.0/jboss-eap-6.1.0
	var jbossEngineHomeDir = getJbossEngineHomeDir();
	
	// e.g. /app/middleware/jboss-eap-instances-created-by-jon/dev1-poc1-01/vault/data
	var jbossVaultHomeDir = getJbossVaultHomeDir(jbossInstanceName);

	// e.g. /srv/logs/jboss
	var jbossLogHomeDir = getJbossLogHomeDir();
	
	// e.g. /srv/data/jboss
	var jbossDataHomeDir = getJbossDataHomeDir();
	
	// e.g. /srv/jboss/tools
	var jbossToolsHomeDir = getJbossToolsHomeDir();
	
	// e.g. 239.0.0.25
	var jbossMultiCastAddress = getJbossMultiCastAddress();

	// e.g. usrjnk
	var jbossdeploymentLinuxuser = getJbossdeploymentLinuxuser();

	// e.g. jonadmin
	var jbossAdminUser = getJBossUserUsedByJON();

	//TODO hard coded for the moment
	var jbossJvmXms = "512m";
    var jbossJvmXmx = "512m";
    var jbossJvmMaxPermSize = "256m";

    
	//if (serviceLevel != "bronze"){	
	//}  
	//else {
	//	println("no");
	//}
        
	println("Creating new JBoss instance with Xms = " + jbossJvmXms + ", Xmx = " + jbossJvmXmx + ", MaxPermSize = " + jbossJvmMaxPermSize + ".");
	println("To change the JVM parameters adapt file : " + jbossInstanceDir + "/jboss-eap6.conf .");	
	
	// create configuration that replaces the variables of the JON bundle (at deployment)
	// find help on properties here : https://docs.jboss.org/author/display/RHQ45/JBossAS7+-+Standalone+Server 
	
	// get or create the destination
	var destination = getDestination(jbossInstanceDir, bundle, linuxMachineGroup, jbossInstanceDir);
	var config = new Configuration() ;
	config.put( new PropertySimple("JBOSS_INSTANCE_NAME", jbossInstanceName));
	config.put( new PropertySimple("JBOSS_CLUSTER_NAME_PREFIX", jbossClusterNamePrefix));
	
	config.put( new PropertySimple("JBOSS_ENGINE_HOME", jbossEngineHomeDir));
	config.put( new PropertySimple("JBOSS_INSTANCES_HOME", jbossInstancesHomeDir));
	
	config.put( new PropertySimple("JBOSS_ADMIN_USER", jbossAdminUser));
	config.put( new PropertySimple("JBOSS_ADMIN_PW", jbossAdminPassword));
	config.put( new PropertySimple("JBOSS_MULTICAST_ADDRESS", jbossMultiCastAddress));
	config.put( new PropertySimple("JBOSS_VAULT_HOME", jbossVaultHomeDir));
	config.put( new PropertySimple("JBOSS_LOG_HOME", jbossLogHomeDir));
	config.put( new PropertySimple("JBOSS_DATA_HOME", jbossDataHomeDir));
	config.put( new PropertySimple("JBOSS_TOOLS_HOME", jbossToolsHomeDir));

    config.put( new PropertySimple("JBOSS_JVM_XMS", jbossJvmXms));
    config.put( new PropertySimple("JBOSS_JVM_XMX", jbossJvmXmx));
    config.put( new PropertySimple("JBOSS_JVM_MAXPERMSIZE", jbossJvmMaxPermSize));

    config.put( new PropertySimple("JBOSSDEPLOYMENT_LINUXUSER", jbossdeploymentLinuxuser));
	
	// get last version of bundle
	var bundleVersion = getLastBundleVersion(bundle);
	deployBundle(destination, bundleVersion, config, "deploying " + jbossInstanceName, true)
}


/**
 * As soon as a JBoss is in the discovery queue this function will import it and adapt the password and name of the new JON ressource 
 * @param machineName - e.g. "roland.cdg.redhat.com"
 * @param jbossInstanceName - "dev1-poc1-01"
 * @param jbossAdminPassword - e.g. "abcdefghijklm"
 *
 */
function addAutoDiscoveredJBossOnSpecificMachineToJonInventory(machineName, jbossInstanceName, jbossAdminPassword) {
	
	runAutodiscoveryOnPlatform(machineName);

	var millisecondsToSleepAfterJonDiscovery = getMillisecondsToSleepAfterJonDiscovery();	
	java.lang.Thread.sleep(millisecondsToSleepAfterJonDiscovery);
	
	// e.g. /srv/jboss/jboss-eap-instances
	var jbossInstancesHomeDir = getJbossInstancesHomeDir();
	
	// e.g. /srv/jboss/jboss-eap-instances
	var jbossManagementRealm = getJbossManagementRealm();
	
	// e.g. /app/middleware/jboss-eap-instances-created-by-jon/dev1-poc1-01

// JON 3.1.2
	//var resourceKeyValue = jbossInstancesHomeDir + "/" + jbossInstanceName;
// JON 3.2.0
  var resourceKeyValue = "hostConfig: " + jbossInstancesHomeDir + "/" + jbossInstanceName + "/configuration/standalone.xml";

	var jbossEAP6Type = getJBossEAP6Type();

	var importedJboss = importResouceViaTypeAndKey(jbossEAP6Type, resourceKeyValue);
	if (importedJboss != null){

		// rename JON ressource : JBoss (e.g. from "EAP (0.0.0.0:10390)" to "dev1-poc1-1"
		// oldName = "EAP (0.0.0.0:10390)"
		var oldName = importedJboss.getName();
		// newName = "dev1-poc1-1" 
		importedJboss.setName(jbossInstanceName + " (EAP6)");
		importedJboss.name;
		importedJboss = ResourceManager.updateResource(importedJboss);

		// update user / password of JBoss in inventory to be able to connect to JBoss
		var conf = ConfigurationManager.getPluginConfiguration(importedJboss.id);

		var jbossUserUsedByJON = getJBossUserUsedByJON();
		var jbossStartScript = getJBossStartScriptURL(jbossInstanceName);
		var jbossStartScriptArgs = getJBossStartScriptArgs();
		
		conf.setSimpleValue("user", jbossUserUsedByJON);
		conf.setSimpleValue("password", jbossAdminPassword);
		conf.setSimpleValue("realm", jbossManagementRealm);
		conf.put(new PropertySimple("startScript", jbossStartScript));
		conf.put(new PropertySimple("startScriptPrefix",""));
		conf.put(new PropertySimple("startScriptArgs", jbossStartScriptArgs));
		
		ConfigurationManager.updatePluginConfiguration(importedJboss.id, conf);
		println("JBoss was added to JON inventory. JBoss should be preconfigured and available (not red) when accessing the JON coregui web console");
	}  
	else {
		println("No JBoss with specified charateristics in discovery queue or JBoss already imported into inventory");
		println("");
		println("If this is unusual and you can find the JBoss in the discovery queue : <JON-INSTANCE>/coregui/#Inventory/Resources/AutodiscoveryQueue ");
		println("this is probably due to JBoss starting slower than :" + millisecondsToSleepAfterJonDiscovery );
		println("howto fix it : stop the JBoss via ssh, purge the JBoss instance in JON, set getMillisecondsToSleepAfterJonDiscovery() in JON CLI script, start again");
	}
}

/**
 * set up a JBoss EAP profile fully automatic
 * @param jbossInstanceName - e.g. "dev1-poc1-01"
 * @param clusterOption - "clusterEnabled" or "clusterDisabled"
 * @param bundleName - e.g. "eap-6.1.0_jboss-profile"
 * @param groupName - e.g. "static-group-linux-boxes"
 *
 * e.g createNewJBossProfileFullAutomatic("dev1-poc1-01", "clusterEnabled", "eap-6.1.0_jboss-profile" , "static-group-linux-boxes")
 */
 function createNewJBossProfileFullAutomatic(jbossInstanceName, clusterOption, bundleName, groupName) {
	
	var generatedRandomPassword = getGeneratedRandomPassword();
	
	// TODO when clusterEnabled than session replication OK, otherwise desactivate session replication
	// "clusterEnabled" or "clusterDisabled"
	// make sure that the instance name is formatted the right way
	
	println("TODO : write test case --> the backend has denied the choice of your project name, please respect the naming convention <4-letter-env>-<4-letter-project>-<2-digits> : e.g. dev1-poc1-01");
	// TODO check if name respects the naming convention" 	
	println("TODO check if name respects the naming convention");
	var jbossEnvironment 	= jbossInstanceName.substring(0,jbossInstanceName.indexOf('-'));
	var jbossProject 		= jbossInstanceName.substring(jbossInstanceName.indexOf("-")+1, jbossInstanceName.lastIndexOf("-"));
	var jbossInstance     	= jbossInstanceName.substring(jbossInstanceName.lastIndexOf('-')+1);
	
	// create the cluster name from the instance name
	jbossClusterNamePrefix = jbossEnvironment + "-" + jbossProject;
	
	// deploys and starts new JBoss
	deployNewJBossProfile(jbossInstanceName, jbossClusterNamePrefix, generatedRandomPassword, bundleName, groupName);

	// here I have to loop through all the machines that JBoss was deployed to
	// and add them one by one to the JON inventory
	var linuxMachineGroup = getGroup(groupName, getLinuxType(), "nothing" , false);
	linuxMachinesArray=linuxMachineGroup.getExplicitResources().toArray();
	for (var i=0; i < linuxMachinesArray.length; i++)
	{
		println("adding JBoss on machine : " + linuxMachinesArray[i].name);
		addAutoDiscoveredJBossOnSpecificMachineToJonInventory(linuxMachinesArray[i].name, jbossInstanceName, generatedRandomPassword);
	}
}

 /**
  * Add Apache to inventory
  *
  * @param machineName
  */
function addAllAutoDiscoveredApacheToJonInventory(machineName) {
	
	runAutodiscoveryOnPlatform(machineName);
	
	var millisecondsToSleepAfterJonDiscovery = getMillisecondsToSleepAfterJonDiscovery();
	java.lang.Thread.sleep(millisecondsToSleepAfterJonDiscovery);
	
	var apacheType = getApacheType();
	var apacheKey = getApacheKey();

	var importedApache = importResouceViaTypeAndKey(apacheType, apacheKey);
}

/**
 * Get the measurement definition
 *
 * @param metricInternalName metricInternalName of the metric as in the UE
 * @param resourceType The resource-type
 * https://access.redhat.com/site/documentation/en-US/JBoss_Operations_Network/3.1/html/Dev_Complete_Resource_Reference/JBossAS7-JBossAS7_Host_Controller-Managed_Server-JVM-Memory_Pool.html
 **/
function getMeasurementDefinition(metricInternalName, resourceType)
{
	var measurementDefinitions = null;
	var measurementDefinitionCriteria = new MeasurementDefinitionCriteria;
	
	measurementDefinitionCriteria.addFilterName(metricInternalName);
	measurementDefinitionCriteria.addFilterResourceTypeId(resourceType.id);
	
	measurementDefinitions = MeasurementDefinitionManager.findMeasurementDefinitionsByCriteria(measurementDefinitionCriteria);
	
	return measurementDefinitions.get(0);
}

/**
 * Remove item from the inventory
 *
 * @param resourceName The name of the resource to remove from the inventory
 */
function removeResource(resourceName)
{
	var criteria = new ResourceCriteria();
	criteria.addFilterName(resourceName);
	
	var resources = ResourceManager.findResourcesByCriteria(criteria);
	var resourceIds = [];
	
	if (resources.size() > 0) {
		for (i = 0; i < resources.size(); i++) {
			resource = resources.get(i);
			resourceIds[i] =  resource.id;
		}
	}
	ResourceManager.uninventoryResources(resourceIds);
}

/**
 * get hold of an existing machine
 *
 * @param  machineName
 */
function getMachine(machineName)
{
	var criteria = new ResourceCriteria()
	
	criteria.addFilterResourceCategories([ResourceCategory.valueOf("PLATFORM")])
	criteria.addFilterName(machineName);
	criteria.strict=true;
	
	var machineList = ResourceManager.findResourcesByCriteria(criteria);
	if (machineList.size()!=1) {
		throw error("Error calling script getMachine("+ machineName +") : " + machineList);
	}
	else {
		return machineList.get(0);
	}
}

/**
 * get hold of a jbossInstace object
 *
 * @param  jbossInstanceName
 * @param  machineName
 *
 * @returns jbossInstance
 */
function getJbossInstanceOnMachine(jbossInstanceName, machineName)
{
	var os = getMachine(machineName);
	
	var jbossEap6Type = getJBossEAP6Type();
	
	var criteria = new ResourceCriteria();
	criteria.addFilterName(jbossInstanceName);
	criteria.addFilterResourceTypeId(jbossEap6Type.id);
	criteria.addFilterParentResourceId(os.id)
	var servers = ResourceManager.findResourcesByCriteria(criteria);
	
	// we have a new JBoss instance
	if (servers.size()==0) {
		println("No JBoss server " + jbossInstanceName + " found on machine " + machineName);
		return null;
	}
	// we have an existing JBoss instance
	else if (servers.size()==1) {
		return servers.get(0);
	}
	else {
		throw error("multiple ressources correspond to your criteria getJbossInstanceOnMachine("+ jbossInstanceName + "," + machineName +")");
	}
}

/**
 * add script server to JON inventory
 * e.g createSlotManagerScriptServer("roland.cdg.redhat.com")
 */
function createSlotManagerScriptServer(machineName) {

  var os = getMachine(machineName);

  // e.g. /srv/jboss/tools/jboss-slot-manager.sh
  var jbossSlotManagerScript = getJbossSlotManagerScript();

  var jbossSlotManagerScriptDirectory = jbossSlotManagerScript.substring(0, jbossSlotManagerScript.lastIndexOf('/'));

  var jbossSlotManagerScriptDescription = "jboss-slot-manager.sh [get-free-slot , get-all-free-slots , get-all-slots-used-and-free]";

  var conf = new Configuration();
  conf.put(new PropertySimple("executable", jbossSlotManagerScript));
  conf.put(new PropertySimple("workingDirectory", jbossSlotManagerScriptDirectory));
  conf.put(new PropertySimple("fixedDescription", jbossSlotManagerScriptDescription));

  server = DiscoveryBoss.manuallyAddResource(getScriptServerType().id, os.id, conf);
  return server;
}

/**
 * executes script  /srv/jboss/tools/jboss-slot-manager.sh on machineName with passedInArgument as parameter
 * e.g executeSlotManagerScriptServer("roland.cdg.redhat.com", "get-all-free-slots")
 *
 * @param  machineName
 * @param  passedInArgument : either ["get-free-slot" , "get-all-free-slots" , "get-all-slots-used-and-free"]
 *
 * @returns string : 'get-free-slot' returns 'usrjbs01'; 'get-all-free-slots' returns 'usrjbs01,usjbs02' ;'get-all-slots-used-and-free' returns 'usrjbs01,usrjbs02,usrjbs03,usrjbs04' 
 */
function executeSlotManagerScriptServer(machineName, passedInArgument) {
   
  var os = getMachine(machineName);
  
  // e.g. /srv/jboss/tools/jboss-slot-manager.sh
  var jbossSlotManagerScript = getJbossSlotManagerScript();

    var criteria = new ResourceCriteria();
    criteria.addFilterResourceKey(jbossSlotManagerScript);
    criteria.addFilterParentResourceId(os.id)
    var servers = ResourceManager.findResourcesByCriteria(criteria);

    // we found no script server instance
    if (servers.size() == 0) {
        println("No Script server " + jbossSlotManagerScript + " found on machine " + machineName);
        return null;
    }
    // we have an existing script server instance
    else if (servers.size()==1) {

        var scriptServer = servers.get(0);

        //set the config properties for the operation
        var config = new Configuration();
        config.put(new PropertySimple("arguments", passedInArgument) );

        // we schedule the execution of the script without using the result variable that is returned
        var result = OperationManager.scheduleResourceOperation(scriptServer.id, "execute", 0, 1, 0, 10000000, config, "description");

        // search in Operations History for the right
        var opcrit = ResourceOperationHistoryCriteria();
        var array = [];
        array[0] = scriptServer.id;
        opcrit.addFilterResourceIds(array);
        // fetchResults has to be set to true, otherwise the "output" value is not retrived
        opcrit.fetchResults(true);
        opcrit.addFilterOperationName("execute");
        // we need to add a sleep of 3 seconds to be sure that the database was updated, therefore the operationsArray is up to date
        java.lang.Thread.currentThread().sleep(3000);
        var operationsArray = OperationManager.findResourceOperationHistoriesByCriteria(opcrit);

        // get the operation data
        var lastHistoryOperationIndex = 0;
	var arraySize = operationsArray.totalSize.toString();
        if ( arraySize =! 0) {
        	lastHistoryOperationIndex = arraySize - 1;
        }
        var lastHistoryOperation = operationsArray.get(lastHistoryOperationIndex);
        // get the results
        var returnConfigurationObject = lastHistoryOperation.getResults();
        var outputValueOfScript = returnConfigurationObject.getSimpleValue("output");
        return outputValueOfScript;
    }
    else {
        throw error("multiple ressources correspond to your criteria getAllAvailableSlots("+ machineName + "," + jbossSlotManagerScript +")");
    }
}
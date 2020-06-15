/**
 * agent.js
 * Implements processes available to the main adapter program
 * Can make use of agent support services and interface to gateway
 */

const config = require('./configuration');
const gateway = require('./gatewayInterface');
const services = require('./services');
const Log = require('../_classes/logger');
const persistance = require('../_persistance/interface');


/**
 * Initialization process of the agent module;
 * Loads from memory credentials of registered objects;
 * Performs actions necessary to restart/init agent;
 * @async
 * @returns {boolean}
 */
module.exports.initialize = async function(){
    let logger = new Log();

    try{
        logger.info('Agent startup initiated...', 'AGENT');
        // Check current configuration 
        if(!config.gatewayId || !config.gatewayPwd) throw new Error('Missing gateway id or credentials...');
        
        // Get objects OIDs stored locally
        let registrations = await persistance.getItem('registrations', null);

        // Load mappings and configurations
       await persistance.loadConfigurationFile('dataurls');
       await persistance.loadConfigurationFile('properties');
       await persistance.loadConfigurationFile('events');

        // Login objects
        await services.doLogins(registrations);

        // Get status of registrations in platform
        let objectsInPlatform = await gateway.getRegistrations();

        // Compare local regitrations with platform registrations
        services.compareLocalAndRemote(registrations, objectsInPlatform);

        // Initialize event channels
        for(let i = 0, l = registrations.length; i<l; i++){
            let thing = await persistance.getItem('registrations', registrations[i]);
            let events = thing.events || [];
            if(events.length > 0) await services.activateEventChannels(registrations[i], events);
        }
        logger.info('All event channels created!', 'AGENT');

        // Subscribe event channels
        // await this.subscribeEvents(); Subscription via API

        // Store configuration info
        await persistance.reloadConfigInfo();

        // End of initialization
        logger.info('Agent startup completed!', 'AGENT');
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, 'AGENT');
        return Promise.reject(false);
    }
}

/**
 * Stops gateway connections before killing adapter app;
 * @async
 * @returns {boolean}
 */
module.exports.stop = async function(){
    let logger = new Log();
    try{
        // Get objects OIDs stored locally
        let registrations = await persistance.getLocalRegistrations();
        // Do logouts
        await services.doLogouts(registrations);
        logger.info("Gateway connections closed", 'AGENT');
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, 'AGENT');
        return Promise.reject(false);
    }
}

/**
 * Register one object;
 * This function enables adapters to access registration services programatically;
 * It is a wrapper of the Gateway call for registration, it simplifies the process;
 * Only requires the body of the new item
 * @async
 * @param {object} body
 * @returns {object} registration response
 */    
module.exports.registerObject = async function(body){
    try{
        let response = await services.registerObject(body);
        return Promise.resolve(response);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Unregister one object;
 * This function enables adapters to access registration services programatically;
 * It is a wrapper of the Gateway call for unregistration, it simplifies the process;
 * Only requires the oid of the item to be removed;
 * @async
 * @param {String} oid
 * @returns {object} registration response
 */    
module.exports.unregisterObject = async function(oid){
    try{
        let obj = { oids: [oid] };
        let response = await services.removeObject(obj);
        return Promise.resolve(response);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
* Subscribes service to all events defined in mapper.json;
* Note: There has to be an object registered acting as service collecting events;
* @async
* @returns {boolean}
*/
module.exports.subscribeEvents = async function(){
    try{
        let subscriptions = await persistance.getMappers();
        let oid = config.serviceOid;
        if(!oid) throw new Error('There is no service assigned for data collection...');
        await services.subscribeEvents(oid, subscriptions);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}

/**
 * Unsubscribes service from all events defined in mapper.json;
 * @async
 * @returns {boolean}
 */
module.exports.unsubscribeEvents = async function(){
    try{
        let subscriptions = await persistance.getMappers();
        let oid = config.serviceOid;
        if(!oid) throw new Error('There is no service assigned for data collection...');
        await services.unsubscribeEvents(oid, subscriptions);
        return Promise.resolve(true);
    }catch(err){
        return Promise.reject(err);
    }
}
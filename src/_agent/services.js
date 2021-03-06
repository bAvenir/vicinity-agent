/**
 * services.js
 * Implements support functionality
 * Can be used by agent.js and controllers.js
 */

const Log = require('../_classes/logger');
let logger = new Log();
const gateway = require('./gatewayInterface');
const Regis = require('./_classes/registration');

let services = {};

/**
 * Perform login of all registered objects
 */
services.doLogins = async function(array){
    try{
        await gateway.login(); // Start always the gateway first
        let actions = [];
        for(var i = 0, l = array.length; i < l; i++){
            actions.push(gateway.login(array[i]));
        }
        await Promise.all(actions);
        logger.info('All logins finalized', "AGENT");
        return Promise.resolve("All logins finalized");
    } catch(err) {
        logger.error(err, "AGENT");
        return Promise.reject(false);
    }
}

/**
 * Perform logout of all registered objects
 */
services.doLogouts = async function(array){
    try{
        let actions = [];
        for(var i = 0, l = array.length; i < l; i++){
            actions.push(gateway.logout(array[i]));
        }
        await Promise.all(actions);
        await gateway.logout(); // Stop always the gateway last
        logger.info('All logouts were successful', "AGENT");
        return Promise.resolve("Logouts were successful");
    } catch(err) {
        logger.error(err, "AGENT");
        return Promise.reject(false);
    }
}

/**
 * Register object in platform
 * Only 1 by 1 - No multiple registration accepted
 */
services.registerObject = async function(body){
    let registration = new Regis();
    try{
        let td = await registration.buildTD(body);
        let result = await gateway.postRegistrations(td);
        if(result.message[0].error) throw new Error("Platform parsing failed, please revise error: " + JSON.stringify(result.message[0].error));
        await registration.storeCredentials(result.message[0]);
        // Login new objects
        let actions = [];
        for(var i = 0, l = result.message.length; i < l; i++){
            actions.push(gateway.login(result.message[i].oid));
        }
        await Promise.all(actions);
        return Promise.resolve(result.message);
    } catch(err) {
        logger.error(err, "AGENT");
        return Promise.reject(false);
    }
}

/**
 * Remove object from platform
 */
services.removeObject = async function(body){
    try{
        let wrapper = Regis.addRemovalWrapper(body.oids);
        let result = await gateway.removeRegistrations(wrapper);
        await Regis.removeCredentials(body.oids);
        return Promise.resolve(result.message.message);
    } catch(err) {
        logger.error(err, "AGENT");
        return Promise.reject(false);
    }
}

/**
 * Compare Local infrastracture with platform
 * Both should have the same objects registered
 */
services.compareLocalAndRemote = function(local, platform){
    try{
        let oidArray = platform.map((item)=>{ return item.id.info.oid });
        for(let i = 0, l = local.length; i<l; i++){
            if(oidArray.indexOf(local[i]) === -1) throw new Error('Local and platform objects are not the same')
        }
        logger.info('Local and platform objects match!', 'AGENT');
        return true;
    } catch(err) {
        logger.warn(err, 'AGENT');
        return false;
    }
}

/**
 * Activate event channels
 * After starting the adapter of registering new objects is triggered
 */
services.activateEventChannels = async function(oid, events){
    try{
        if(typeof events === 'string') events = events.split(',');
        for(let i = 0, l = events.length; i<l; i++){
            // Add channels synchronously
            await gateway.activateEventChannel(oid, events[i]);
        }
        return Promise.resolve(true);
    } catch(err) {
        logger.warn('Event channels were not created, check gateway connection', 'AGENT');
        return Promise.resolve(false);
    }
}

/**
 * Subscribe all events in mapper.json
 */
services.subscribeEvents = async function(oid, subscribers){
        try{
            for(let i=0, l=subscribers.length; i<l; i++){
                if(subscribers[i].interaction === "event"){
                    await gateway.subscribeRemoteEventChannel(oid ,subscribers[i].oid, subscribers[i].eid);
                }            
            }
        }catch(err){
            logger.error(err, "AGENT");
            return Promise.reject(false);
        }
    }

/**
 * Unsubscribe all events in mapper.json
 */
services.unsubscribeEvents = async function(oid, subscribers){
    try{
        for(let i=0, l=subscribers.length; i<l; i++){
            if(subscribers[i].interaction === "event"){
                await gateway.unsubscribeRemoteEventChannel(oid ,subscribers[i].oid, subscribers[i].eid);
            }
        }
    }catch(err){
        logger.error(err, "AGENT");
        return Promise.reject(false);
    }
}

module.exports = services;
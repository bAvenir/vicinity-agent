/**
* interfaces.js
* Interface to interact with the persistance layer services
* @interface
*/ 

const Log = require('../_classes/logger');
const fileMgmt = require('./_modules/fileMgmt');
const redis = require('./_modules/redis');
const services = require('./services');
const config = require('./configuration');

// External files

/**
 * Import configuration files to memory;
 * Does not overwrite, only loads interactions or registrations not existing previously;
 * NOTE: Use delete endpoints of API to remove old interactions or registrations;
 * on ENOENT error resolves an empty array;
 * on unexpected error resolves a boolean;
 * @async 
 * @param {string} file_name
 * @returns {array} 
 */  
module.exports.loadConfigurationFile = async function(fileType){
    let logger = new Log();
    try{ 
        let file = await fileMgmt.read(`${config.rootPath}/agent/imports/${fileType}.json`);
        let array = JSON.parse(file);
        let countRows = array.length;
        if(countRows>0 && fileType !== 'mqtt'){
            await services.storeInMemory(fileType, array);
            return Promise.resolve(array);
        } else if(fileType === 'mqtt') {
            logger.info(`File ${fileType}.json loaded ${countRows} topics`, "PERSISTANCE");
            return Promise.resolve(array);
        } else {
            logger.info(`There are no ${fileType} available to load`, "PERSISTANCE");
            return Promise.resolve(array);
        }
    } catch(err) {
        if (err.code === 'ENOENT') {
            logger.warn(`File ${fileType}.json not found`, "PERSISTANCE");
            return Promise.resolve([]);
        } else {
            logger.error(err, "PERSISTANCE");
            return Promise.resolve(false);
        }
    }
}

/**
 * Exports to file some hash stored in memory;
 * Additional backup possibility;
 * Can create 4 different files: registrations, properties, actions, events;
 * on error rejects boolean false;
 * @async
 * @param {string} fileType
 * @returns {boolean}
 */
module.exports.saveConfigurationFile = async function(fileType){
    let logger = new Log();
    try{ 
        let data = await services.getFromMemory(fileType);
        await fileMgmt.write(`${config.rootPath}/agent/exports/${fileType}.json`, data);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(false);
    }
}

// MANAGE OIDs and Credentials

/**
 * Get credentials for one OID;
 * From memory;
 * on error rejects boolean false;
 * @async
 * @param {string} oid
 * @returns {string}
 */
module.exports.getCredentials = async function(oid){
    let logger = new Log();
    try{ 
        let credentials = await redis.hget(oid, 'credentials');
        return Promise.resolve(credentials);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Add new VICINTY OBJECTS to local storage;
 * Object sent as argument needs the same structure as the objects in registration.json;
 * To memory;
 * on error rejects boolean false;
 * @async
 * @param {object} data Contains all fields necessary to register a VICINITY object
 * @returns {boolean}
 */
module.exports.addRegistration = async function(data){
    let logger = new Log();
    try{ 
        await services.addOid(data);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Remove VICINTY OBJECTS from local persistance;
 * expects array of [ {string} oid ] -> VICINITY IDs;
 * From memory;
 * on error rejects boolean false;
 * @async
 * @param {array} oids
 * @returns {boolean}
 */
module.exports.removeRegistration = async function(oids){
    let logger = new Log();
    try{ 
        if(typeof oids === 'string') oids = [oids];
        for(let i = 0, l = oids.length; i<l; i++){
            await services.removeOid(oids[i]);
        }
        // Persist changes to dump.rdb
        await redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get all OIDs - VICINTY OBJECTS;
 * Retrieves array of oids or just one oid and complete (If oid provided);
 * IF no argument provided returns all VICINITY objects IDs stored in local persistance [ARRAY];
 * IF argument oid provided, returns [OBJECT]; 
 * From memory;
 * on error rejects boolean false;
 * @async
 * @param {string} oid VICINITY ID [OPTIONAL]
 * @returns {object}
 */
module.exports.getLocalRegistrations = async function(oid){
    let logger = new Log();
    try{ 
        let registrations = [];
        if(oid){
            registrations = await redis.hgetall(oid);
        } else {
            registrations = await redis.smembers('registrations');
        }
        return Promise.resolve(registrations);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get count of VICINITY objects IDs stored in local persistance;
 * on error rejects boolean false;
 * @async
 * @returns {integer}
 */
module.exports.getCountOfRegistrations = async function(){
    let logger = new Log();
    try{ 
        let count = await redis.scard('registrations');
        return Promise.resolve(count);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// MANAGE INTERACTION OBJECTS

/**
 * Get an interaction previously stored
 * Interactions are user defined
 * on error rejects boolean false;
 * @async
 * @param {string} type (preperties, actions, events)
 * @param {string} id interaction name
 * @returns {object} JSON with TD interaction schema
 */
module.exports.getInteractionObject = async function(type, id){
    let logger = new Log();
    try{ 
        let obj = await redis.hget(type + ":" + id, "body");
        return Promise.resolve(obj);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Add interaction objects
 * Interactions are user defined
 * on error rejects boolean false;
 * @async
 * @param {string} type (preperties, actions, events, mappers)
 * @param {boolean}
 */
module.exports.addInteractionObject = async function(type, body){
    let logger = new Log();
    try{ 
        let result = await services.storeInMemory(type, [body]);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Remove interaction objects
 * Interactions are user defined
 * on error rejects boolean false;
 * @async
 * @param {string} type (preperties, actions, events)
 * @param {string} id interaction name
 * @returns {boolean}
 */
module.exports.removeInteractionObject = async function(type, id){
    let logger = new Log();
    try{ 
        await redis.srem(type, id);
        await redis.hdel(`${type}:${id}`, 'body');
        await redis.hdel(`${type}:${id}`, 'vicinity');
        // Persist changes to dump.rdb
        await redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Check if incoming request is valid;
 * Oid exists in infrastructure and has pid;
 * on error rejects error object;
 * @async
 * @param {string} oid
 * @param {string} pid
 * @param {boolean}
 */
module.exports.combinationExists = async function(oid, pid){
    try{
        let exists = await redis.sismember('registrations', oid);
        if(!exists) throw new Error(`Object ${oid} does not exist in infrastructure`);
        let properties = await redis.hget(oid, 'properties');
        let p = properties.split(',');
        if(p.indexOf(pid) === -1 ) throw new Error(`Object ${oid} does not have property ${pid}`);
        return Promise.resolve(true);
    } catch(err){
        return Promise.reject(err);
    }    
}

// Configuration info MANAGEMENT

/**
 * Store configuration information;
 * Needs to be removed first;
 * on error rejects error string;
 * @async
 * @returns {boolean}
 */
module.exports.reloadConfigInfo = async function(){
    try{ 
        await services.removeConfigurationInfo();
        await services.addConfigurationInfo();
        return Promise.resolve(true);
    } catch(err) {
        return Promise.reject("Problem storing configuration information...")
    }
}

/**
 * Get configuration information;
 * From memory;
 * on error rejects error string;
 * @async
 * @returns {object}
 */
module.exports.getConfigInfo = async function(){
    try{
        await services.removeConfigurationInfo();
        await services.addConfigurationInfo();
        let result = await redis.hgetall('configuration');
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject("Problem retrieving configuration information...")
    }
}

/**
 * Get Interactions or registrations array
 * If id is provided get the related object
 * From memory
 * on error rejects error string;
 * @async
 * @param {string} type registrations or interaction type
 * @param {string} id [OPTIONAL]
 * @returns {object}
 */
module.exports.getConfigDetail = async function(type, id){
    let result;
    try{
        if(id){
            let hkey = type === 'registrations' ? id : `${type}:${id}`;
            result = await redis.hgetall(hkey);
            if(type !== 'registrations' && result) result = JSON.parse(result.body);
        } else {
            result = await redis.smembers(type);
        }
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject("Problem retrieving configuration details...")
    }
}

// CACHE

/**
 * Add property request to cache
 * Support for caching incoming requests
 * on error resolves false;
 * @async
 * @param {string} key path requested
 * @param {string} data data requested
 * @returns {boolean}
 */
module.exports.addToCache = async function(key, data){
    try{
        redis.caching(key, data);
        return Promise.resolve(true);
    } catch(err){
        return Promise.resolve(false);
    }
}

// System Health

/**
 * Check Redis availability
 * on error resolves false;
 * @async
 * @returns {string}
 */
module.exports.redisHealth = async function(){
    try{
        await redis.health();
        return Promise.resolve('OK');
    } catch(err){
        return Promise.resolve(false);
    }
}

// MAPPINGS 

/**
 * Get all mappers
 */
module.exports.getMappers = async function(){
    try{
        let aux = [];
        let result = [];
        let mappers = await redis.smembers('MAPPERS');
        for(let i=0, l=mappers.length; i<l; i++){
            aux = mappers[i].split(':');
            result.push({'oid': aux[0], 'interaction': aux[1], 'interaction_id': aux[2]});
        }
        return Promise.resolve(result);
    } catch(err){
        return Promise.resolve(false);
    }
}
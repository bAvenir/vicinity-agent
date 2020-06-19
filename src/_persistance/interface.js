/**
* interfaces.js
* Interface to interact with the persistance layer services
* @interface
*/ 

const Log = require('../_classes/logger');
let logger = new Log();
const fileMgmt = require('./_modules/fileMgmt');
const redis = require('./_modules/redis');
const services = require('./services');
const config = require('./configuration');
const modelFactory = require('./_models/modelFactory');
let models = new modelFactory();

// Import/Export data to/from persistance

/**
 * Import configuration files to memory;
 * Does not overwrite, only loads interactions or registrations not existing previously;
 * NOTE: Use delete endpoints of API to remove old interactions or registrations;
 * on ENOENT error resolves an empty array;
 * on unexpected error resolves a boolean;
 * @async 
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @returns array
 */  
module.exports.loadConfigurationFile = async function(type){
    try{ 
        let file = await fileMgmt.read(`${config.rootPath}/agent/imports/${type}.json`);
        let array = JSON.parse(file);
        let countRows = array.length;
        let model = models.getInstance(type);
        if(countRows>0 && type !== 'mqtt'){
            await model.storeInMemory(array);
            logger.info(`File ${type}.json, loaded ${countRows} elements`, "PERSISTANCE");
            return Promise.resolve(array);
        } else {
            logger.info(`There are no ${type} available to load`, "PERSISTANCE");
            return Promise.resolve(array);
        }
    } catch(err) {
        if (err.code === 'ENOENT') {
            logger.warn(`File ${type}.json not found`, "PERSISTANCE");
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
 * on error rejects boolean false;
 * @async
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @returns boolean
 */
module.exports.saveConfigurationFile = async function(type){
    try{ 
        let model = models.getInstance(type);
        await model.loadFromMemory();
        await fileMgmt.write(`${config.rootPath}/agent/exports/${type}.json`, data);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(false);
    }
}

// Work with data models in DB

/**
 * Add item to db
 * @async
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @param {object} data 
 * @returns boolean 
 */
module.exports.addItem = async function(type, data){
    try{
        let model = models.getInstance(type);
        let result = await model.addItem(data);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(err);
    }
}

/**
 * Remove item from db
 * @async
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @param {string} id 
 * @returns boolean  
 */
module.exports.removeItem = async function(type, id){
    try{
        let model = models.getInstance(type);
        let result = await model.removeItem(id);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(err);
    }
}

/** 
 * Get item from db;
 * Returns object if ID provided;
 * Returns array of ids if ID not provided;
 * @async
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @param {string} id [OPTIONAL]
 * @returns object 
 */
module.exports.getItem = async function(type, id){
    try{
        let model = models.getInstance(type);
        let result = await model.getItem(id);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(err);
    }
}

/**
 * Get count of items in model stored in db
 * @async
 * @param {string} type [registrations, properties, actions, events, dataurls, mappers]
 * @returns integer
 */
module.exports.getCountOfItems = async function(type){
    try{
        let model = models.getInstance(type);
        let result = await model.getCountOfItems();
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE");
        return Promise.reject(err);
    }
}

// Useful functionalities

/**
 * Get credentials for one OID;
 * From memory;
 * on error rejects boolean false;
 * @async
 * @param {string} oid
 * @returns string
 */
module.exports.getCredentials = async function(oid){
    try{ 
        let credentials = await redis.hget(oid, 'credentials');
        return Promise.resolve(credentials);
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
 * @param boolean
 */
module.exports.combinationExists = async function(oid, pid){
    try{
        let exists = await redis.sismember('registrations', oid);
        if(!exists) throw new Error(`Object ${oid} does not exist in infrastructure`);
        let type = await redis.hget(oid, 'type');
        let properties = await redis.hget(oid, 'properties');
        if(type !== "core:Service"){
            let p = properties != null ? properties.split(',') : [];
            if(p.indexOf(pid) === -1 ) throw new Error(`Object ${oid} does not have property ${pid}`);
        }
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
 * @returns boolean
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
 * @returns object
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

// CACHE

/**
 * Add property request to cache
 * Support for caching incoming requests
 * on error resolves false;
 * @async
 * @param {string} key path requested
 * @param {string} data data requested
 * @returns boolean
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
 * @returns string
 */
module.exports.redisHealth = async function(){
    try{
        await redis.health();
        return Promise.resolve('OK');
    } catch(err){
        return Promise.resolve(false);
    }
}
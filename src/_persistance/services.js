/**
* services.js
* Methods and functionality for the persistance module
*/

const redis = require('./_modules/redis');
const gateway = require('../_agent/services');
const Log = require('../_classes/logger');
let logger = new Log();
// Define possible interactions
const interactions = {
    "properties" : {"id": "pid", "does": "monitors"},
    "actions" : {"id": "aid", "does": "affects"},
    "events" : {"id": "eid", "does": "monitors"}
}

let fun = {};

 // STORE IN MEMORY

 /**
 * Add new VICINTY OBJECTS to local storage;
 * Objects sent as argument needs the same structure as the objects in registration.json;
 * To memory;
 * on error rejects boolean false;
 * @async
 * @param {array} array Contains objects with all fields necessary to register a VICINITY object
 * @returns {boolean}
 */
fun.storeRegistrations = async function(array){
    try{ 
        for(let i = 0, l = array.length; i<l; i++){
            let data = array[i];
            let todo = [];
            if(!data.credentials || !data.password || !data.adapterId || !data.name || !data.type ){
                throw new Error(`Object with oid ${data.oid} misses some fields, its credentials could not be stored...`);
            }
            let exists = await redis.sismember('registrations', data.oid);
            if(!exists){
                todo.push(redis.sadd('registrations', data.oid));
                todo.push(redis.hset(data.oid, 'oid', data.oid));
                todo.push(redis.hset(data.oid, 'credentials', data.credentials));
                todo.push(redis.hset(data.oid, 'password', data.password));
                todo.push(redis.hset(data.oid, 'adapterId', data.adapterId));
                todo.push(redis.hset(data.oid, 'name', data.name));
                todo.push(redis.hset(data.oid, 'type', data.type));
                if(data.properties && data.properties.length) todo.push(redis.hset(data.oid, 'properties', data.properties.toString()));
                if(data.events && data.events.length) todo.push(redis.hset(data.oid, 'events', data.events.toString()));
                if(data.actions && data.actions.length) todo.push(redis.hset(data.oid, 'agents', data.agents.toString()));
                await Promise.all(todo);
            } else {
                logger.warn(`OID: ${data.oid} is already stored in memory.`, "PERSISTANCE")
            }
            if(data.events && data.events.length) await gateway.activateEventChannels(data.oid, data.events);
        }
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.warn(err, "PERSISTANCE")
        return Promise.resolve(false)
    }
}

/**
 * Stores user defined interactions in memory
 * @param {string} type (preperties, actions, events)
 * @param {array} array interactions array with JSONs
 */
fun.storeInteractions = async function(type, array){
    let interaction =  interactions[type];
    let id = interaction['id'];
    let does = interaction['does'];
    let success = true; // Case some interaction is not valid, no error but no success either
    logger.debug(`Storing ${type}...`, "PERSISTANCE")
    let l = array.length;
    logger.debug(`Trying to store ${l} ${type}`, "PERSISTANCE");
    for(let i=0; i<l; i++){
        try{
            let aux = array[i][id] == null ? "test" : array[i][id]; // Avoid type error in redis
            let exists = await redis.sismember(type, aux);
            let notNull = (array[i][id] != null && array[i][does] != null);
            if(!exists && notNull){
                await redis.sadd(type, array[i][id]);
                await redis.hset(`${type}:${array[i][id]}`, 'body', JSON.stringify(array[i]));
                await redis.hset(`${type}:${array[i][id]}`, 'vicinity', array[i][does]);
                logger.debug(`${type} entry ${i} : ${array[i][id]} stored`, "PERSISTANCE");
            } else {
                if(exists) logger.warn(`${type} entry ${i} already exists`, "PERSISTANCE");
                if(!notNull) logger.warn(`${type} entry ${i} misses id or interaction`, "PERSISTANCE");
                success = false;
            }
        } catch(err) {
            logger.error(err, "PERSISTANCE")
            return Promise.reject(err);
        }
    }
    // Persist changes to dump.rdb
    redis.save();
    return Promise.resolve(success);
}

/**
 * Stores mapper in memory
 * @param {array} array map array with JSONs
 */
fun.storeMappers = async function(array){
    try{ 
        for(let i = 0, l = array.length; i<l; i++){
            let data = array[i];
            if(!data.id){
                throw new Error(`Missing oid`);
            }
            let exists = await redis.sismember('mappers', data.id);
            if(!exists){
                let todo = [];
                todo.push(redis.sadd('mappers', data.id));
                for(let key in data){
                    todo.push(redis.hset(`map:${data.id}`, key, data[key]));
                }
                await Promise.all(todo);
            } else {
                logger.warn(`OID: ${data.id} is already stored in mappers memory.`, "PERSISTANCE")
            }
        }
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.warn(err, "PERSISTANCE")
        return Promise.resolve(false)
    }
}

/**
 * Store data urls in memory
 */
fun.storeDataurls = async function(array){
    try{ 
        // Old dataurls are removed every time we store new ones
        await redis.remove('dataurls'); 
        for(let i=0, l=array.length; i<l; i++){
            if(array[i].oid && array[i].interaction){
                await redis.sadd('dataurls', `${array[i].oid}:${array[i].interaction}:${array[i].interaction_id}`);
            }
        }
        logger.info('Dataurls stored in memory', 'PERSISTANCE');
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(err);
    }
}


// LOAD FROM MEMORY

/**
 * Get all registrations
 */
fun.loadRegistrations = async function(){
    let result;
    try{
        let oids = await redis.smembers('registrations');
        let todo = [];
        for(let i = 0, l = oids.length; i<l; i++){
            todo.push(redis.hgetall(oids[i]));
        }
        result = await Promise.all(todo);
        result = JSON.stringify(result);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(err);
    }
}

/**
 * Get all interactions
 */
fun.loadInteractions = async function(type){
    let result;
    try{
        let all_interactions = await redis.smembers(type);
        result = '['
        for(let i = 0, l = all_interactions.length; i<l; i++){
            if(i === 0){
                result = result + await redis.hget(`${type}:${all_interactions[i]}`, 'body'); 
            } else {
                result = result + ',' + await redis.hget(`${type}:${all_interactions[i]}`, 'body'); 
            }
        }
        result = result + ']';
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(err);
    }
}

/**
 * Get all dataurls 
 */
fun.loadDataurls = async function(){
    try{
        let aux = [];
        let result = [];
        let mappers = await redis.smembers('dataurls');
        for(let i=0, l=mappers.length; i<l; i++){
            aux = mappers[i].split(':');
            result.push({'oid': aux[0], 'interaction': aux[1], 'interaction_id': aux[2]});
        }
        return Promise.resolve(result);
    } catch(err){
        logger.error(err, "PERSISTANCE")
        return Promise.resolve(false);
    }
}

/**
 * Get all mappers
 */
fun.loadMappers = async function(){
    let result;
    try{
        let ids = await redis.smembers('mappers');
        let todo = [];
        for(let i = 0, l = ids.length; i<l; i++){
            todo.push(redis.hgetall(`map:${ids[i]}`));
        }
        result = await Promise.all(todo);
        result = JSON.stringify(result);
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(err);

    }
}

// Add items


// Remove items

/**
 * Remove VICINTY OBJECTS from local persistance;
 * From memory;
 * on error rejects boolean false;
 * @async
 * @param {array} ids [ array of oids ]
 * @returns {boolean}
 */
fun.removeRegistrations = async function(ids){
    try{ 
        for(let i = 0, l = ids.length; i<l; i++){
            let oid = ids[i];
            let todo = [];
            todo.push(redis.srem('registrations', oid));
            todo.push(redis.hdel(oid, 'credentials'));
            todo.push(redis.hdel(oid, 'password'));
            todo.push(redis.hdel(oid, 'type'));
            todo.push(redis.hdel(oid, 'name'));
            todo.push(redis.hdel(oid, 'adapterId'));
            todo.push(redis.hdel(oid, 'properties'));
            todo.push(redis.hdel(oid, 'events'));
            todo.push(redis.hdel(oid, 'agents'));
            await Promise.all(todo);
        }
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
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
* @param {array} ids [interaction name]
* @returns {boolean}
*/
fun.removeInteractions = async function(type, ids){        
    try{ 
        for(let i = 0, l = ids.length; i<l; i++){
            let id = ids[i];
            let todo = [];
            todo.push(redis.srem(type, id));
            todo.push(redis.hdel(`${type}:${id}`, 'body'));
            todo.push(redis.hdel(`${type}:${id}`, 'vicinity'));
            await Promise.all(todo);
        }
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
* Remove dataurls objects
* on error rejects boolean false;
* @async
* @param {string} type
* @param {string} id oid:interaction:interaction_id
* @returns {boolean}
*/
fun.removeDataurls = async function(id){        
    try{ 
        await redis.srem('dataurls', id);
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
* Remove mapper objects
* on error rejects boolean false;
* @async
* @param {array} ids [oid]
* @returns {boolean}
*/
fun.removeMappers = async function(ids){        
    try{ 
        for(let i = 0, l = ids.length; i<l; i++){
            let id = ids[i];
            redis.srem('mappers', id);
            redis.remove(`map:${id}`);
        }
        // Persist changes to dump.rdb
        redis.save();
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// Get items

/**
 * Get registrations array
 * If id is provided get the related object, otherwise array
 * From memory
 * on error rejects error string;
 * @async
 * @param {string} id [OPTIONAL]
 * @returns {object}
 */
fun.getRegistrations = async function(id){
    let result;
    try{
        if(id){
            result = await redis.hgetall(id);
        } else {
            result = await redis.smembers('registrations');
        }
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false);
    }
}

/**
 * Get an interaction previously stored [OR array with all names];
 * Interactions are user defined;
 * on error rejects boolean false;
 * @async
 * @param {string} type (preperties, actions, events)
 * @param {string} id interaction name [OPTIONAL]
 * @returns {object} JSON with TD interaction schema
 */
fun.getInteractions = async function(type, id){
    try{ 
        let obj;
        if(id){
            obj = await redis.hget(type + ":" + id, "body");
        } else {
            obj = await redis.smembers(type);
        }
        return Promise.resolve(obj);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

/**
 * Get mappers array
 * If id is provided get the related object, otherwise array
 * From memory
 * on error rejects error string;
 * @async
 * @param {string} id [OPTIONAL]
 * @returns {object}
 */
fun.getMappers = async function(id){
    let result;
    try{
        if(id){
            result = await redis.hgetall(`map:${id}`);
        } else {
            result = await redis.smembers('mappers');
        }
        return Promise.resolve(result);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false);
    }
}

// Get count of items

fun.getCount = async function(type){
    try{ 
        let count = await redis.scard(type);
        return Promise.resolve(count);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// Functions for managing the overall configuration info
// Basic counting and reporting of the resources in the local storage

/**
 * Adds configuration of agent info
 * To memory
 */
fun.addConfigurationInfo = async function(){
    try{ 
        let d = new Date();
        let numregis = await redis.scard('registrations');
        let numprops = await redis.scard('properties');
        let numactions = await redis.scard('actions');
        let numevents = await redis.scard('events');
        await redis.hset("configuration", "date", d.toISOString());
        await redis.hset("configuration", "registrations", numregis);
        await redis.hset("configuration", "properties", numprops);
        await redis.hset("configuration", "actions", numactions);
        await redis.hset("configuration", "events", numevents);
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

 /**
 * Removes configuration of agent info
 * From memory
 */
fun.removeConfigurationInfo = async function(){
    try{ 
        await redis.hdel("configuration", "date");
        await redis.hdel("configuration", "registrations");
        await redis.hdel("configuration", "properties");
        await redis.hdel("configuration", "actions");
        await redis.hdel("configuration", "events");
        return Promise.resolve(true);
    } catch(err) {
        logger.error(err, "PERSISTANCE")
        return Promise.reject(false)
    }
}

// Export module
module.exports = fun;
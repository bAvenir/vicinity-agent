/**
* controllers.js
* Process simple incoming from admin API
* Send to other modules for advanced processing 
*/ 

const Log = require('../_classes/logger');
const persistance =  require('../_persistance/interface');
const agent = require('../_agent/interface');
const gateway = require('../_agent/gatewayInterface');

// ADMINISTRATION endpoints

/**
 * Returns last configuration status
 */
module.exports.getConfiguration = function(req, res){
    let logger = new Log();
    persistance.getConfigInfo()
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Reload configuration files
 */
module.exports.reloadConfiguration = function(req, res){
    let logger = new Log();
    agent.initialize()
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

// REGISTRATIONS monitoring

/**
 * Get registered items in local infrastructure
 * @param {string} id [OPTIONAL - If absent get list of all ids]
 * @returns List of ids or object with info
 */
module.exports.registrations = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('registrations', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

// INTERACTIONS management

/**
 * MANAGE registered properties in local infrastructure
 * GET
 * POST
 * DELETE
 */

 /**
 * Get registered properties in local infrastructure
 * @param {string} id [OPTIONAL - If absent get list of all ids]
 * @returns List of ids or object with info
 */
module.exports.propertiesGet = function(req, res){
    let id = req.params.id || null; // If null => Use gtw credentials
    let logger = new Log();
    persistance.getConfigDetail('properties', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Add property to local infrastructure
 * @param {object} VICINITY_COMPLIANT_PROPERTY_JSON
 */
module.exports.propertiesPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('properties', body)
    .then((response) => {
        if(response){
            logger.info(`New property ${body.pid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New property ${body.pid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Remove interaction from local infrastructure
 * @param {string} id interaction name to be deleted
 */
module.exports.propertiesDelete = function(req, res){
    let id = req.params.id || null; 
    let logger = new Log();
    persistance.removeInteractionObject('properties', id)
    .then((response) => {
        logger.info(`Property ${id} removed`, "ADMIN");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * MANAGE registered actions in local infrastructure
 * GET
 * POST
 * DELETE
 */

/**
 * Get registered actions in local infrastructure
 * @param {string} id [OPTIONAL - If absent get list of all ids]
 * @returns List of ids or object with info
 */
module.exports.actionsGet = function(req, res){
    let id = req.params.id || null; 
    let logger = new Log();
    persistance.getConfigDetail('actions', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Add action to local infrastructure
 * @param {object} VICINITY_COMPLIANT_PROPERTY_JSON
 */
module.exports.actionsPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('actions', body)
    .then((response) => {
        if(response){
            logger.info(`New action ${body.aid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New action ${body.aid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Remove interaction from local infrastructure
 * @param {string} id interaction name to be deleted
 */
module.exports.actionsDelete = function(req, res){
    let id = req.params.id || null;
    let logger = new Log();
    persistance.removeInteractionObject('actions', id)
    .then((response) => {
        logger.info(`Action ${id} removed`, "ADMIN");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * MANAGE registered events in local infrastructure
 * GET
 * POST
 * DELETE
 */

/**
 * Get registered events in local infrastructure
 * @param {string} id [OPTIONAL - If absent get list of all ids]
 * @returns List of ids or object with info
 */
module.exports.eventsGet = function(req, res){
    let id = req.params.id || null;
    let logger = new Log();
    persistance.getConfigDetail('events', id)
    .then((response) => {
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Add event to local infrastructure
 * @param {object} VICINITY_COMPLIANT_PROPERTY_JSON
 */
module.exports.eventsPost = function(req, res){
    let logger = new Log();
    let body = req.body;
    persistance.addInteractionObject('events', body)
    .then((response) => {
        if(response){
            logger.info(`New event ${body.eid} posted`, "ADMIN");
            res.json({error: false, message: "Success"});
        } else {
            logger.info(`New event ${body.eid} could not be posted`, "ADMIN");
            res.json({error: false, message: "Problem adding, please check logs"});
        }
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Remove interaction from local infrastructure
 * @param {string} id interaction name to be deleted
 */
module.exports.eventsDelete = function(req, res){
    let id = req.params.id || null;
    let logger = new Log();
    persistance.removeInteractionObject('events', id)
    .then((response) => {
        logger.info(`Event ${id} removed`, "ADMIN");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

// IMPORT/EXPORT endpoints

/**
 * Imports from ./agent/imports
 * If file does not exist it fails
 */
module.exports.importFile = function(req, res){
    let path = req.path;
    let n = path.lastIndexOf('/');
    let type = path.substring(n + 1);
    let logger = new Log();
    persistance.loadConfigurationFile(type)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

/**
 * Exports to ./agent/imports
 */
module.exports.exportFile = function(req, res){
    let path = req.path;
    let n = path.lastIndexOf('/');
    let type = path.substring(n + 1);
    let logger = new Log();
    persistance.saveConfigurationFile(type)
    .then(() => {
        res.json({error: false, message: 'DONE'})
    })
    .catch((err) => {
        logger.error(err, "ADMIN");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    })
}

// HEALTHCHECK endpoints

/**
 * Get connection status of main adapter components
 * @returns {'Redis' : string, 'Gateway': string, 'NodeApp': string}
 */
  module.exports.healthcheck = async function(req, res){
    let redisHealth = await persistance.redisHealth();
    let gtwHealth = await gateway.health();
    res.json({error: false, message: {'Redis' : redisHealth, 'Gateway': gtwHealth, 'NodeApp': 'OK'} });
}
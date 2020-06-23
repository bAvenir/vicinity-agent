/**
* controllers.js
* Process simple incoming requests to API
* DOES not receive calls from internal processes
* Send to services.js for advanced processing 
*/ 

const Log = require('../../_classes/logger');
let logger = new Log();
const gtwInterface = require('../gatewayInterface');
const services = require('../services');
const agent = require('../interface');

/**
 * Login endpoint
 * @param {string} id [OPTIONAL - If absent use gateway OID]
 */
module.exports.login = function(req, res){
    let oid = req.params.id || null; // If null => Use gtw credentials
    gtwInterface.login(oid)
    .then(() => {
        logger.info("Login successful", "AGENT");
        res.json({error: false, message: "Login successful"})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Logout endpoint
 * @param {string} id [OPTIONAL - If absent use gateway OID]
 */
module.exports.logout = function(req, res){
    let oid = req.params.id || null; // If null => Use gtw credentials
    gtwInterface.logout(oid)
    .then(() => {
        logger.info("Logout successful", "AGENT");
        res.json({error: false, message: "Logout successful"})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

module.exports.getRegistrations = function(req, res){
    gtwInterface.getRegistrations()
    .then((response) => {
        logger.info("Objects registered with your gateway retrieved", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Registration endpoint
 * Body:
 * @param {STRING} name --> Object Human Readable Name
 * @param {STRING} type --> VICINITY valid type i.e. core:Device
 * @param {STRING} adapterId --> Id of the Object in your Infrastructure 
 * @param {STRING} version --> OPTIONAL 
 * @param {STRING} description --> OPTIONAL 
 * @param {OBJECT} locatedIn --> OPTIONAL 
 * @param {ARRAY} properties --> [name_prop1, ...] OPTIONAL 
 * @param {ARRAY} actions --> [name_action1, ...] OPTIONAL
 * @param {ARRAY} events --> [name_event1, ...] OPTIONAL
 */
module.exports.postRegistrations = function(req, res){
    let body = req.body;
    services.registerObject(body)
    .then((response) => {
        logger.info("Objects registered and credentials stored!", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Remove registered object endpoint
 * Body:
 * @param {OBJECT} oids --> {oids: [oid1, oid2, ...] }
 */
module.exports.removeRegistrations = function(req, res){
    let body = req.body;
    services.removeObject(body)
    .then((response) => {
        logger.info("Objects unregistered", "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

/**
 * Discovery endpoint
 * Check what remote objects can you see
 * @param {string} id [OPTIONAL - If absent use gateway OID]
 */
module.exports.discovery = function(req, res){
    let oid = req.params.id;
    gtwInterface.discovery(oid)
    .then((response) => {
        logger.info(`Neighbours of ${oid} discovered`, "AGENT");
        res.json({error: false, message: response})
    })
    .catch((err) => {
        logger.error(err, "AGENT");
        res.json({error: true, message: "Something went wrong, check the logs for more info"})
    }) 
}

// ***** Consume remote resources *****

    /**
     * Request remote property
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} oid (remote VICINITY OID)
     * @param {STRING} pid (remote VICINITY property)
     */
    module.exports.getProperty = function(req, res){
        let oid = req.params.id;
        let remote_oid = req.params.oid;
        let pid = req.params.pid;
        gtwInterface.getProperty(oid, remote_oid, pid)
        .then((response) => {
            logger.info(`Property ${pid} of ${remote_oid} received` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Set remote property
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} oid (remote VICINITY OID)
     * @param {STRING} pid (remote VICINITY property)
     */
    module.exports.putProperty = function(req, res){
        let oid = req.params.id;
        let remote_oid = req.params.oid;
        let pid = req.params.pid;
        gtwInterface.putProperty(oid, remote_oid, pid)
        .then((response) => {
            logger.info(`Property ${pid} of ${remote_oid} set` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Create event channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} eid (name of my channel)
     */
    module.exports.activateEventChannel = function(req, res){
        let oid = req.params.id;
        let eid = req.params.eid;
        gtwInterface.activateEventChannel(oid, eid)
        .then((response) => {
            logger.info(`Channel ${eid} of ${oid} activated` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Publish event to channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} eid (name of my channel)
     * Body OBJECT JSON
     */
    module.exports.publishEvent = function(req, res){
        let oid = req.params.id;
        let eid = req.params.eid;
        let body = req.body;
        gtwInterface.publishEvent(oid, eid, body)
        .then((response) => {
            logger.info(`Message sent to channel ${eid} of ${oid}` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Deactivate event channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} eid (name of my channel)
     */
    module.exports.deactivateEventChannel = function(req, res){
        let oid = req.params.id;
        let eid = req.params.eid;
        gtwInterface.deactivateEventChannel(oid, eid)
        .then((response) => {
            logger.info(`Channel ${eid} of ${oid} deactivated` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Status of remote event channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} oid (remote VICINITY OID)
     * @param {STRING} eid (name of my channel)
     */
    module.exports.statusRemoteEventChannel = function(req, res){
        let oid = req.params.id;
        let remote_oid = req.params.oid;
        let eid = req.params.eid;
        gtwInterface.statusRemoteEventChannel(oid, remote_oid, eid)
        .then((response) => {
            logger.info(`Get status of remote channel ${eid} of ${remote_oid}` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Subscribe remote event channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} oid (remote VICINITY OID)
     * @param {STRING} eid (name of my channel)
     */
    module.exports.subscribeRemoteEventChannel = function(req, res){
        let oid = req.params.id;
        let remote_oid = req.params.oid;
        let eid = req.params.eid;
        gtwInterface.subscribeRemoteEventChannel(oid, remote_oid, eid)
        .then((response) => {
            logger.info(`Subscribed to remote channel ${eid} of ${remote_oid}` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    /**
     * Unsubscribe remote event channel
     * @param {STRING} id (my VICINITY OID)
     * @param {STRING} oid (remote VICINITY OID)
     * @param {STRING} eid (name of my channel)
     */
    module.exports.unsubscribeRemoteEventChannel = function(req, res){
        let oid = req.params.id;
        let remote_oid = req.params.oid;
        let eid = req.params.eid;
        gtwInterface.unsubscribeRemoteEventChannel(oid, remote_oid, eid)
        .then((response) => {
            logger.info(`Unsubscribed to remote channel ${eid} of ${remote_oid}` , "AGENT");
            res.json({error: false, message: response})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    // Subscribe all events (in mapper.json)

    module.exports.eventsSubscribeAll = function(req, res){
        agent.subscribeEvents()
        .then(() => {
            res.json({error: false, message: 'Events subscribed'})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

    module.exports.eventsUnsubscribeAll = function(req, res){
        agent.unsubscribeEvents()
        .then(() => {
            res.json({error: false, message: 'Events unsubscribed'})
        })
        .catch((err) => {
            logger.error(err, "AGENT");
            res.json({error: true, message: "Something went wrong, check the logs for more info"})
        }) 
    }

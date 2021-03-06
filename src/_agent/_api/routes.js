/**
 * routes.js
 * Agent router interface
 * Endpoint 'agent'
 * Gateway calls endpoint agent to send data collected from the network to the agent
 * @interface
 */
const express = require('express');
let router = express.Router();
let controller = require('./controllers');
let cache = require('../../_persistance/_modules/redis');

router
    // ***** Agent endpoints *****
  .get('/login', controller.login)
  .get('/login/:id', controller.login)
  .get('/logout', controller.logout)
  .get('/logout/:id', controller.logout)
  .get('/registration', controller.getRegistrations)
  .post('/registration', controller.postRegistrations)
  .post('/registration/remove', controller.removeRegistrations)
  .get('/discovery', controller.discovery)
  .get('/discovery/:id', controller.discovery)
    // ***** Consume remote resources *****
  .get('/properties/:id/:oid/:pid', controller.getProperty) // Request remote property
  .put('/properties/:id/:oid/:pid', controller.putProperty) // Update remote property
  // .get('/actions/:id/:oid/:aid/:tid') // Get action status
  // .post('/actions/:id/:oid/:aid') // Start task on remote action
  // .put('/actions/:id/:oid/:aid') // Update status of task
  // .delete('/actions/:id/:oid/:aid/:tid') // Stop task
  .post('/events/local/:id/:eid', controller.activateEventChannel) // Create my event channel
  .put('/events/local/:id/:eid', controller.publishEvent) // Put a message in my event channel
  .delete('/events/local/:id/:eid', controller.deactivateEventChannel) // Delete my event channel
  .get('/events/remote/:id/:oid/:eid', controller.statusRemoteEventChannel) // Get status of a remote event channel
  .post('/events/remote/:id/:oid/:eid', controller.subscribeRemoteEventChannel) // Subscribe to remote event channel
  .delete('/events/remote/:id/:oid/:eid', controller.unsubscribeRemoteEventChannel) // Unsubscribe to remote event channel
  .get('/events/subscribe', controller.eventsSubscribeAll)
  .delete('/events/subscribe',controller.eventsUnsubscribeAll);

  module.exports = router;

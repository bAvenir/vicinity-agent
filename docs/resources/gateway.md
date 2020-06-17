# interface.js

Interface to interact with the gateway API

Used from external (API) and internal requests

@interface

<hr>

## AUTHENTICATION

    Login an object in VICINITY;
    Does not reject on error;
    @async
    @param {oid: string}
    @returns {error: boolean, message: string} 

login = async function(oid){}

    Logout an object in VICINITY;
    Does not reject on error;
    @async
    @param {oid: string}
    @returns {error: boolean, message: string} 

logout = async function(oid){}

<hr>

## REGISTRATION

    Get list of objects registered under your gateway;
    (Using the access point credentials generated for it);
    @async
    @returns {error: boolean, message: array of TDs} 

getRegistrations = async function(){}

    Register object/s under your gateway;
    (Using the access point credentials generated for it);
    @async
    @param {body: Array of TDs}
    @returns {error: boolean, message: array of TDs} 

postRegistrations = async function(body){}

    Remove object/s under your gateway;
    (Using the access point credentials generated for it);
    @async
    @param {body: Array of OIDs}
    @returns {error: boolean, message: [{value: string, result: string, error: string}]} 

removeRegistrations = async function(body){}

### @TBD:
* Soft update
* Hard update

<hr>

## DISCOVERY

    Retrieve all objects that your object can see;
    (Understand object as gateway, service or device instance);
    (Using the credentials of a service or device);
    @async
    @param {oid: string}
    @returns {error: boolean, message: [oid: string]} 

discovery = async function(oid){}


### @TBD:
* SPARQL query

<hr>

## RESOURCE CONSUMPTION

Properties, events and actions

    Get a property;
    (Using the credentials of a service or device);
    @async
    @param {oid: string, remote_oid: string, pid: string}
    @returns {error: boolean, message: object} 

getProperty = async function(oid, remote_oid, pid){}


    Set a property (PUT);
    (Using the credentials of a service or device);
    @async
    @param {oid: string, remote_oid: string, pid: string}
    @returns {error: boolean, message: object} 

putProperty = async function(oid, remote_oid, pid){}

    Activate the event channel;
    (Using the credentials of a service or device);
    @async
    @param {oid: string, eid: string}
    @returns {error: boolean, message: string} 

activateEventChannel = async function(oid, eid){}


    Publish event to channel;
    (Using the credentials of a service or device);
    @async
    @param {oid: string, eid: string, body: object}
    @returns {error: boolean, message: string} 

publishEvent = async function(oid, eid, body){}

    Deactivate event channel;
    (Using the credentials of a service or device);
    @async
    @param {oid: string, eid: string}
    @returns {error: boolean, message: string} 

deactivateEventChannel = async function(oid, eid){}

    Get status of remote event channel;
    (Using the credentials of a service or device);
    @async
    @param {oid: string, eid: string}
    @returns {error: boolean, message: string} 

statusRemoteEventChannel = async function(oid, remote_oid, eid){}

    Subscribe to remote event channel;
    (Using the credentials of a service or device);
    Does not reject on error;
    @async
    @param {oid: string, eid: string}
    @returns {error: boolean, message: string} 

subscribeRemoteEventChannel = async function(oid, remote_oid, eid){}

    Unsubscribe to remote event channel;
    (Using the credentials of a service or device);
    Does not reject on error;
    @async
    @param {oid: string, eid: string}
    @returns {error: boolean, message: string} 

unsubscribeRemoteEventChannel = async function(oid, remote_oid, eid){}

### @TBD
* Execute action on remote object
* Update status of a task
* Retrieve the status or a return value of a given task
* Cancel a task in progress

<hr>

## HealthCheck

    Does a health check by trying to log in VICINITY;
    @async
    @param {oid: string}
    @returns {error: boolean, message: string} 

health = async function(){}

# agent.js

Implements processes available to the main adapter program

Can make use of agent support services and interface to gateway

<hr>

    Initialization process of the agent module;
    Loads from memory credentials of registered objects;
    Performs actions necessary to restart/init agent;
    @async
    @returns {boolean}

initialize = async function(){}


    Stops gateway connections
    @async
    @returns {boolean}

stop = async function(){}

    Register one object;
    This function enables adapters to access registration services programatically;
    It is a wrapper of the Gateway call for registration, it simplifies the process;
    Only requires the body of the new item
    @async
    @param {object} body
    @returns {object} registration response
   
registerObject = async function(body){}

    Unregister one object;
    This function enables adapters to access registration services programatically;
    It is a wrapper of the Gateway call for unregistration, it simplifies the process;
    Only requires the oid of the item to be removed;
    @async
    @param {String} oid
    @returns {object} registration response
   
unregisterObject = async function(oid){}


    Subscribes service to all events defined in mapper.json;
    Note: There has to be an object registered acting as service collecting events;
    @async
    @returns {boolean}

subscribeEvents = async function(){}

    Unsubscribes service from all events defined in mapper.json;
    @async
    @returns {boolean}

unsubscribeEvents = async function(){}
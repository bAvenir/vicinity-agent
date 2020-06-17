# bAvenir VICINITY agent

![npm](https://img.shields.io/npm/v/bavenir-agent?style=plastic)
![NPM](https://img.shields.io/npm/l/bavenir-agent?style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/bAvenir/vicinity-agent?style=plastic)

This is a Node.js project that acts as integration support for VICINITY adapters. Provides functionality to manage VICINITY items lifecycle and consumption of resources.

The agent is used as an NPM package that integrates with the generic VICINITY adapter. The purpose of this tools is to ease the development of new adapters using the generic adapter as platform.

## Pre-requisites

* Node.js >= v12

## How to install

* npm install < package-name >

## Documentation of the API

The agent exposes several routes (admin/ and api/) that the adapter includes in its API. 

Once the VICINITY adapter is running, we can see the agent routes in **localhost:PORT/agent-docs**

## Default models persisted to memory

NOTE: The names used by the following lists and hashes are reserved, try not to override if you decide to reuse the redis module.

* Default lists
    * properties: [properties] list in REDIS contains registered PIDs
    * events: [events] list in REDIS contains registered EIDs
    * actions: [actions] list in REDIS contains registered AIDs
    * registrations [oids]
    * mappers [oids]
    * dataurls [oid:interaction:interaction_id]

* Default hashes
    * registration: 
        * id --> oid of your register devices
        * Hash contains --> {oid, name, type, properties, events, actions, password, credentials}
    * interaction:
        * interaction_id --> properties:brightness 
        * Hash contains --> { body: stringified object with interaction description in JSON, vicinity: vicinity interaction type }
    * mappers: User defined, they mapping key should be the VICINITY oid
    * configuration: Managed by agent

* Default strings 
    * /objects/{oid}/{interaction}/{interaction_id} --> Used for caching

More info available in folder src/_persistance/_models, on top of each file the model is described in the comments.

## Other resources available

When the adapter installs the VICINITY agent, several resources become available to it:

For DEVELOPERS, see **docs/resources** for description of the available functions to build an extension to the adapter.

* Agent
    * Gateway: Interface to the gateway API.
    * Services: Agent services based on series of interactions with VICINITY using the Gateway.

* Persistance
    * Redis: Access to control REDIS db. You can extend the persistance functionality. Careful using this feature to avoid overriding agent default hashes and lists.
    * Persistance: Services based on REDIS. Interface to more common functions for default models.

* Classes: Agent predefined classes are available to use in the Adapter.
    * logger.js: Logging module
    * request.js: Perform requests to APIs or other services
    * response.js: Response wrapper
    * timer.js: Wrapper for the nodeJS timer, it eases the control of the timers.
    * mqtt.js: Create connections to mqtt servers
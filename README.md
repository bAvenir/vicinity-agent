# bAvenir VICINITY agent

This is a Node.js project that acts as integration support for VICINITY adapters. Provides functionality to manage VICINITY items lifecycle and consumption of resources.

The agent is used as an NPM package that integrates with the generic VICINITY adapter. The purpose of this tools is to ease the development of new adapters using the generic adapter as platform.

## Pre-requisites

* Node.js >= v12

## How to install

* npm install < package-name >

## Documentation of the API

The agent exposes several routes (admin/ and api/) that the adapter includes in its API. 

Once the VICINITY adapter is running, we can see the agent routes in **localhost:PORT/agent-docs**

## Other resources available

When the adapter installs the VICINITY agent, several resources become available to it:

* Agent
    * Gateway: Interface to the gateway API. 
    * Other functionlality: Agent services based on series of interactions with VICINITY using the Gateway.

* Persistance
    * Redis: Access to control REDIS db. You can extend the persistance functionality. Careful using this feature to avoid overriding agent default hashes and lists.
    * Other functionality: Services based on REDIS.

* Classes: Agent predefined classes are available to use in the Adapter. They can be extended and used for new developments.
    * logger.js: Logging module
    * request.js: Perform requests to APIs or other services
    * response.js: Response wrapper
    * timer.js: Wrapper for the nodeJS timer, it eases the control of the timers.
    * mqtt.js: Create connections to mqtt servers
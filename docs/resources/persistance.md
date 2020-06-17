# interfaces.js

Interface to interact with the persistance layer services (REDIS)

@interface

<hr>

## Import/Export data to/from persistance

    Import configuration files to memory;
    Does not overwrite, only loads interactions or registrations not existing previously;
    NOTE: Use delete endpoints of API to remove old interactions or registrations;
    on ENOENT error resolves an empty array;
    on unexpected error resolves a boolean;
    @async 
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @returns array
  
loadConfigurationFile = async function(type){}

    Exports to file some hash stored in memory;
    Additional backup possibility;
    on error rejects boolean false;
    @async
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @returns boolean

saveConfigurationFile = async function(type){}

<hr>

## Work with data models in DB

    Add item to db
    @async
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @param {object} data 
    @returns boolean 

addItem = async function(type, data){}

    Remove item from db
    @async
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @param {string} id 
    @returns boolean  

removeItem = async function(type, id){}

    Get item from db;
    Returns object if ID provided;
    Returns array of ids if ID not provided;
    @async
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @param {string} id [OPTIONAL]
    @returns object 

getItem = async function(type, id){}

    Get count of items in model stored in db
    @async
    @param {string} type [registrations, properties, actions, events, dataurls, mappers]
    @returns integer

getCountOfItems = async function(type){}

<hr>

## Useful functionalities

    Get credentials for one OID;
    From memory;
    on error rejects boolean false;
    @async
    @param {string} oid
    @returns string

getCredentials = async function(oid){}

    Check if incoming request is valid;
    Oid exists in infrastructure and has pid;
    on error rejects error object;
    @async
    @param {string} oid
    @param {string} pid
    @param boolean

combinationExists = async function(oid, pid){}

<hr>

## Configuration info MANAGEMENT

    Store configuration information;
    Needs to be removed first;
    on error rejects error string;
    @async
    @returns boolean

reloadConfigInfo = async function(){}

    Get configuration information;
    From memory;
    on error rejects error string;
    @async
    @returns object

getConfigInfo = async function(){}

<hr>

## CACHE

    Add property request to cache
    Support for caching incoming requests
    on error resolves false;
    @async
    @param {string} key path requested
    @param {string} data data requested
    @returns boolean

addToCache = async function(key, data){}

<hr>

## System Health

    Check Redis availability
    on error resolves false;
    @async
    @returns string

redisHealth = async function(){}
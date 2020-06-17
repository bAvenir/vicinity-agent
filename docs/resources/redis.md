# redis.js

Interface to REDIS DB

<hr>

## CACHE

    Listens to incoming property requests;
    Acts as a middleware for Express Library;
    If the key exists retrieves value from cache;
    @returns {next() or res.json()}

getCached: (req, res, next) => {}


    Store value in cache after request to the source API;
    TTL is configurable in .env file;
    @returns {void}

caching: (key, data) => {}

    Remove manually key stored for the cache;
    @returns {void}
  
delCache: (key) => {}
  
<hr>

## INIT

    Starts REDIS and listens to connect or error events;
    @returns {void}

  start: () => {}


    Checks REDIS connection status;
    Rejects if REDIS not ready;
    @async
    @returns {boolean}

  health: () => {}

<hr>

## PERSIST

    Force saving changes to dump.rdb;
    Use to ensure critical changes will not be lost;
    @async
    @returns {string}
  
save: () => {}

<hr>

## BASIC STRING STORAGE & REMOVAL

    Save a string;
    Custom defined ttl => 0 = no TTL;
    rejects on error;
    @async
    @param {string} key
    @param {*} item
    @param {integer} ttl
    @returns {boolean}

set: (key, item, ttl) => {}

    Remove manually one key or list stored;
    rejects on error a boolean;
    @async
    @param {string} key
    @returns {boolean}

remove: (key) => {}

<hr>

## SETS

    Adds item to set;
    item can be an array of items or a string;
    rejects on error a boolean;
    @async
    @param {string} key
    @param {string} item
    @returns {boolean}

sadd: (key, item) => {}

    Remove item from set;
    item can be an array of items or a string;
    rejects on error a boolean;
    @async
    @param {string} key
    @param {string} item
    @returns {boolean}

srem: (key, item) => {}

    Check if item is a set member;
    rejects on error a boolean;
    @async
    @param {string} key
    @param {*} item
    @returns {boolean}

sismember: (key, item) => {}

    Count of members in set;
    rejects on error a boolean;
    @async
    @param {string} key
    @returns {integer}

scard: (key) => {}

    Retrieve all set members;
    rejects on error a boolean;
    @async
    @param {string} key
    @returns {array of strings}

smembers: (key) => {}

<hr>

## HASH

    Get value of a key in a hash
    rejects on error a boolean;
    @async
    @param {string} hkey
    @param {string} key
    @returns {*}

hget: (hkey, key) => {}

    Set value of a key in a hash;
    rejects on error a boolean;
    @async
    @param {string} hkey
    @param {string} key
    @param {*} value
    @returns {boolean}

hset: (hkey, key, value) => {}

    Remove key in a hash;
    rejects on error a boolean;
    @async
    @param {string} hkey
    @param {string} key
    @returns {boolean}

hdel: (hkey, key) => {}

    Check if key exists in hash;
    rejects on error a boolean;
    @async
    @param {string} hkey
    @param {string} key
    @returns {boolean}

hexists: (hkey, key) => {}

    Get all key:value in a hash;
    rejects on error a boolean;
    @async
    @param {string} hkey
    @returns {object}

hgetall: (hkey) => {}


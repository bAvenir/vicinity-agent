/**
 * redis.js
 * Interface to REDIS DB
 * @interface
 */

var redis = require("redis");
var config = require('../configuration');
var client = redis.createClient(config.dbPort, config.dbHost);
var Log = require('../../_classes/logger');
var logger = new Log();

// Exposes functions for working with the cache db REDIS
module.exports = {
  // CACHE
  /**
   * Listens to incoming property requests ;
   * Acts as a middleware for Express Library;
   * If the key exists retrieves value from cache;
   * @returns {next() or res.json()}
   */
  getCached: (req, res, next) => {
    let redis_key = req.path;
    if(config.cache){
      client.get(redis_key, function(err, reply) {
        if (err) {
          logger.error("Error reading cache", "REDIS");
          res.status(500).json({
            message: "Something Went Wrong"
          })
        }
        if (reply == null) {
          logger.debug("Cache miss " + redis_key, "REDIS");
          next();
        } else {
          logger.debug("Cache hit " + redis_key, "REDIS");
          let response = JSON.parse(reply);  
          res.status(200).json(response);
        }
      });
    } else {
      next(); 
    }
  },
  /**
   * Store value in cache after request to the source API;
   * TTL is configurable in .env file;
   * @returns {void}
   */
  caching: (key, data) => {
    logger.debug("Cache adition " + key + ": " + data, "REDIS");
    client.set(key, JSON.stringify(data), 'EX', config.cacheTtl)
  },
  /**
   * Remove manually key stored for the cache;
   * @returns {void}
   */
  delCache: (key) => {
    client.del(key)
  },
  // INIT
  /**
   * Starts REDIS and listens to connect or error events;
   * @returns {void}
   */
  start: () => {
    client.on("error", function (err) {
        logger.error(err, "REDIS");
        process.exit(1);
    });
    client.on("connect", function() {
        logger.info("Connected successfully to Redis!!", "REDIS");
    });
  },
  /**
   * Checks REDIS connection status;
   * Rejects if REDIS not ready;
   * @async
   * @returns {boolean}
   */
  health: () => {
    return new Promise(function (resolve, reject) {
      client.ping(function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug("Redis is ready: " + reply, "REDIS");
          resolve(true);
        }
      });
    });
  },
  // PERSIST
  /**
   * Force saving changes to dump.rdb;
   * Use to ensure critical changes will not be lost;
   * Does not reject on error, resolves false;
   * @async
   * @returns {string}
   */
  save: () => {
    return new Promise(function (resolve, reject) {
      client.save(function(err, reply) {
        if (err) {
          logger.warn(err, "REDIS");
          resolve(false);
        } else {
          logger.info(`REDIS DB persisted: ${reply}`, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  // BASIC STRING STORAGE & REMOVAL
  /**
   * Save a string;
   * Custom defined ttl => 0 = no TTL;
   * rejects on error;
   * @async
   * @param {string} key
   * @param {*} item
   * @param {integer} ttl
   * @returns {boolean}
   */
  set: (key, item, ttl) => {
    return new Promise(function (resolve, reject) {
      client.set(key, item, 'EX', ttl, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(true);
        }
      });
    });
  },
  /**
   * Remove manually one key or list stored;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @returns {boolean}
   */
  remove: (key) => {
    return new Promise(function (resolve, reject) {
      client.del(key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(true);
        }
      });
    });
  },
  // SETS
  /**
   * Adds item to set;
   * item can be an array of items or a string;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @param {string} item
   * @returns {boolean}
   */
  sadd: (key, item) => {
    return new Promise(function (resolve, reject) {
      client.sadd(key, item, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Remove item from set;
   * item can be an array of items or a string;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @param {string} item
   * @returns {boolean}
   */
  srem: (key, item) => {
    return new Promise(function (resolve, reject) {
      client.srem(key, item, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Check if item is a set member;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @param {*} item
   * @returns {boolean}
   */
  sismember: (key, item) => {
    return new Promise(function (resolve, reject) {
      client.sismember(key, item, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Count of members in set;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @returns {integer}
   */
  scard: (key) => {
    return new Promise(function (resolve, reject) {
      client.scard(key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Retrieve all set members;
   * rejects on error a boolean;
   * @async
   * @param {string} key
   * @returns {array of strings}
   */
  smembers: (key) => {
    return new Promise(function (resolve, reject) {
      client.smembers(key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  // HASH
  /**
   * Get value of a key in a hash
   * rejects on error a boolean;
   * @async
   * @param {string} hkey
   * @param {string} key
   * @returns {*}
   */
  hget: (hkey, key) => {
    return new Promise(function (resolve, reject) {
      client.hget(hkey, key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Set value of a key in a hash;
   * rejects on error a boolean;
   * @async
   * @param {string} hkey
   * @param {string} key
   * @param {*} value
   * @returns {boolean}
   */
  hset: (hkey, key, value) => {
    return new Promise(function (resolve, reject) {
      client.hset(hkey, key, value, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Remove key in a hash;
   * rejects on error a boolean;
   * @async
   * @param {string} hkey
   * @param {string} key
   * @returns {boolean}
   */
  hdel: (hkey, key) => {
    return new Promise(function (resolve, reject) {
      client.hdel(hkey, key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Check if key exists in hash;
   * rejects on error a boolean;
   * @async
   * @param {string} hkey
   * @param {string} key
   * @returns {boolean}
   */
  hexists: (hkey, key) => {
    return new Promise(function (resolve, reject) {
      client.hexists(hkey, key, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  },
  /**
   * Get all key:value in a hash;
   * rejects on error a boolean;
   * @async
   * @param {string} hkey
   * @returns {object}
   */
  hgetall: (hkey) => {
    return new Promise(function (resolve, reject) {
      client.hgetall(hkey, function(err, reply) {
        if (err) {
          logger.error(err, "REDIS");
          reject(false);
        } else {
          logger.debug(reply, "REDIS");
          resolve(reply);
        }
      });
    });
  }
}

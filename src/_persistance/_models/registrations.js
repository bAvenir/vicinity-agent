// Global packages
const services = require('../services');
const Log = require('../../_classes/logger');
let logger = new Log();

/**
 * registrations.js
 * registrations model
 * [registrations] list in REDIS contains registered OIDs
 * Each OID is a hash in REDIS with the following fields:
 * oid, type, credentials, password, adapterId, name, properties, events, agents
 * @class
*/

module.exports = class Registrations {

    constructor(){
      if(!Registrations.instance){
          this.type = 'registrations';
          Registrations.instance = this;
      }
      return Registrations.instance;
    }

  // Methods

  // Static Methods

  /**
   * Store array of whole model in db
   * @async
   * @param {array} array 
   * @returns {boolean} 
   */
  async storeInMemory(array){
    try{
        let success = await services.storeRegistrations(array);
        return Promise.resolve(success);
    } catch(err) {
        logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  /**
   * Get array of whole model from db
   * @async
   * @returns {array} 
   */
  async loadFromMemory(){
    try{
        let result = await services.loadRegistrations();
        return Promise.resolve(result);
    } catch(err) {
      logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  /**
   * Add item to db
   * @async
   * @param {object} data 
   * @returns {boolean} 
   */
  async addItem(data){
    try{
        let success = await services.storeRegistrations([data]);
        return Promise.resolve(success);
    } catch(err) {
      logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  /**
   * Remove item from db
   * @async
   * @param {array} ids 
   * @returns {boolean} 
   */
  async removeItem(ids){
    try{
      if(typeof ids === 'string') ids = [ids];
      services.removeRegistrations(ids); 
      return Promise.resolve(true);
    } catch(err) {
      logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  /**
   * Get item from db;
   * Returns object if ID provided;
   * Returns array of ids if ID not provided;
   * @async
   * @param {string} id [optional]
   * @returns {object} 
   */
  async getItem(id){
    try{
        let result = await services.getRegistrations(id);
        return Promise.resolve(result);
    } catch(err) {
      logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  /**
   * Get count of items in model stored in db
   * @async
   * @returns {integer} 
   */
  async getCountOfItems(){
    try{
      let count = await services.getCount(this.type);
      return Promise.resolve(count);
    } catch(err) {
        logger.debug(err, "MODEL");
        return Promise.reject(err);
    }
  }

  // Private methods

};




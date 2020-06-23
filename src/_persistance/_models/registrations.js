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
        let success = await services.storeRegistrations(array);
        return Promise.resolve(success);
  }

  /**
   * Get array of whole model from db
   * @async
   * @returns {array} 
   */
  async loadFromMemory(){
        let result = await services.loadRegistrations();
        return Promise.resolve(result);
  }

  /**
   * Add item to db
   * @async
   * @param {object} data 
   * @returns {boolean} 
   */
  async addItem(data){
        let success = await services.storeRegistrations([data]);
        return Promise.resolve(success);
  }

  /**
   * Remove item from db
   * @async
   * @param {array} ids 
   * @returns {boolean} 
   */
  async removeItem(ids){
      if(typeof ids === 'string') ids = [ids];
      services.removeRegistrations(ids); 
      return Promise.resolve(true);
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
        let result = await services.getRegistrations(id);
        return Promise.resolve(result);
  }

  /**
   * Get count of items in model stored in db
   * @async
   * @returns {integer} 
   */
  async getCountOfItems(){
      let count = await services.getCount(this.type);
      return Promise.resolve(count);
  }

  // Private methods

};




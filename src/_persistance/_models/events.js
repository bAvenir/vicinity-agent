// Global packages
const services = require('../services');

/**
 * events.js
 * interactions models - properties, events, actions
 * [events] list in REDIS contains registered EIDs
 * Each properties:eid is a hash in REDIS
 * Hash contains --> body { object with interaction description in JSON}, vicinity { vicinity interaction type } 
 * @class
*/

module.exports = class Events {
  
  constructor(){
    if(!Events.instance){
        this.type = 'events';
        Events.instance = this;
    }
    return Events.instance;
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
        let success = await services.storeInteractions(this.type, array);
        return Promise.resolve(success);
  }

  /**
   * Get array of whole model from db
   * @async
   * @returns {array} 
   */
  async loadFromMemory(){
        let result = await services.loadInteractions(this.type);
        return Promise.resolve(result);
  }

  /**
   * Add item to db
   * @async
   * @param {object} data 
   * @returns {boolean} 
   */
  async addItem(data){
        let success = await services.storeInteractions(this.type, [data]);
        return Promise.resolve(success);
  }

  /**
   * Remove item from db
   * @async
   * @param {string} id 
   * @returns {boolean} 
   */
  async removeItem(ids){
      if(typeof ids === 'string') ids = [ids];
      services.removeInteractions(this.type, ids); 
      return Promise.resolve(true);
  }

  /**
   * Get item from db;
   * Returns object if ID provided;
   * Returns array of ids if ID not provided;
   * @async
   * @param {string} id [OPTIONAL]
   * @returns {object} 
   */
  async getItem(id){
        let result = await services.getInteractions(this.type, id);
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
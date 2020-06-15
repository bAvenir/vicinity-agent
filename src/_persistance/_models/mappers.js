// Global packages
const services = require('../services');

/**
 * mappers.js
 * mappers model
 * [mappers] list in REDIS contains OIDs of objects that have a mapping hash
 * The mapping has structure is free up to the developer design
 * NOTE: vicinity OID 'oid' is the only mandatory field of the object
 * @class
*/

module.exports = class Mappers {
  
  constructor(){
    if(!Mappers.instance){
        this.type = 'mappers';
        Mappers.instance = this;
    }
    return Mappers.instance;
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
        let success = await services.storeMappers(array);
        return Promise.resolve(success);
    } catch(err) {
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
        let result = await services.loadMappers();
        return Promise.resolve(result);
    } catch(err) {
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
        let success = await services.storeMappers([data]);
        return Promise.resolve(success);
    } catch(err) {
        return Promise.reject(err);
    }
  }

  /**
   * Remove item from db
   * @async
   * @param {string} id oid 
   * @returns {boolean} 
   */
  async removeItem(ids){
    try{
        if(typeof ids === 'string') ids = [ids];
        let success = await services.removeMappers(ids);
        return Promise.resolve(success);
    } catch(err) {
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
        let result = await services.getMappers(id);
        return Promise.resolve(result);
    } catch(err) {
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
        return Promise.reject(err);
    }
  }

  // Private methods

};
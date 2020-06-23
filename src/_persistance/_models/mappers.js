// Global packages
const services = require('../services');

/**
 * mappers.js
 * mappers model
 * [mappers] list in REDIS contains IDs of objects that have a mapping hash
 * The mapping has structure is free up to the developer design
 * NOTE: There identifier of the hash maps will be map:<some_id>
 * You need to add the prefix map: to avoid overriding other hash maps (E.g: Case that you would be reusing oid as identifier)
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
        let success = await services.storeMappers(array);
        return Promise.resolve(success);
  }

  /**
   * Get array of whole model from db
   * @async
   * @returns {array} 
   */
  async loadFromMemory(){
        let result = await services.loadMappers();
        return Promise.resolve(result);
  }

  /**
   * Add item to db
   * @async
   * @param {object} data 
   * @returns {boolean} 
   */
  async addItem(data){
        let success = await services.storeMappers([data]);
        return Promise.resolve(success);
  }

  /**
   * Remove item from db
   * @async
   * @param {string} id oid 
   * @returns {boolean} 
   */
  async removeItem(ids){
        if(typeof ids === 'string') ids = [ids];
        let success = await services.removeMappers(ids);
        return Promise.resolve(success);
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
        let result = await services.getMappers(id);
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
// Global packages
const services = require('../services');

/**
 * dataurls.js
 * dataurls model
 * [dataurls] list in REDIS contains strings with info to request data from known objects
 * oid:interaction:interaction_id
 * oid is the VICINITY object id
 * interaction can be property, event or action
 * interaction_id can be pid, eid, aid
 * @class
*/

module.exports = class Dataurls {

  constructor(){
    if(!Dataurls.instance){
        this.type = 'dataurls';
        Dataurls.instance = this;
    }
    return Dataurls.instance;
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
        let success = await services.storeDataurls(array);
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
        let result = await services.loadDataurls();
        return Promise.resolve(result);
    } catch(err) {
        return Promise.reject(err);
    }
  }

  /**
   * Add item to db
   * @async
   * @param {object} data {oid: "", interaction": "", interaction_id: ""}
   * @returns {boolean} 
   */
  async addItem(data){
    try{
        let success = await services.storeDataurls([data]);
        return Promise.resolve(success);
    } catch(err) {
        return Promise.reject(err);
    }
  }

  /**
   * Remove item from db
   * @async
   * @param {string} id 
   * @returns {boolean} 
   */
  async removeItem(id){
    try{
        let success = await services.removeDataurls(id);
        return Promise.resolve(success);
    } catch(err) {
        return Promise.reject(err);
    }
  }

  /**
   * Get item from db;
   * Returns array of ids if ID;
   * @async
   * @returns {object} 
   */
  async getItem(){
    try{
        let result = await services.loadDataurls();
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
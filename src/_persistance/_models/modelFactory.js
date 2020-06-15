// Global packages
const registrations = require('./registrations');
const properties = require('./properties');
const events = require('./events');
const actions = require('./actions');
const mappers = require('./mappers');
const dataurls = require('./dataurls');

/**
 * modelFactory.js
 * Factory class to use persistance models
 * @class
*/

module.exports = class modelFactory {

  constructor(){
      if(!modelFactory.instance){
          this.models = {registrations: registrations, 
            properties: properties,
            events: events,
            actions: actions, 
            mappers: mappers, 
            dataurls: dataurls};
          modelFactory.instance = this;
      }
      return modelFactory.instance;
  }

  // Static Methods

  /**
   * Get instance of the class
   * @param {string} type
   */
   getInstance(type){
      let model = this.models[type];
      if(!model) throw new Error(`Undefined type of data model ${type}, [registrations, properties, events, actions, mappers, dataurls]`);
      let newInstance = new model(type); 
      return newInstance;
  }

  /**
   * Get module
   * Use static methods of the class
   * @param {string} type
   */
   getModule(type){
    try{
      let model = this.models[type];
      if(!model) throw new Error(`Undefined type of data model ${type}, [registrations, properties, events, actions, mappers, dataurls]`);
      return model;
    } catch(err) {
      console.log(err);
      return err;
    }
  }
  
};




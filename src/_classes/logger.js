/**
 * logger.js
 * Class that helps building logs
 * @class
 */

const logger = require('../_utils/logger');
const node_environment = process.env.NODE_ENV || 'development';

module.exports = class Log {
  constructor() {
    this.ini = new Date();
  }

  // Methods

  /**
   * Logger methods receive 3 fields
   * @param {STRING} message MANDATORY
   * @param {STRING} agent OPTIONAL (Part of the code reporting the log)
   * @param {*} other OPTIONAL (Additional fields)
   */

  debug(message, agent, other) {
    if(node_environment !== 'production') logger.debug(this._buildLog(this.ini, message, agent, other));
  }
  info(message, agent, other) {
    logger.info(this._buildLog(this.ini, message, agent, other));
  }
  warn(message, agent, other) {
    logger.warn(this._buildLog(this.ini, message, agent, other));
  }
  error(message, agent, other) {
    logger.error(this._buildLog(this.ini, message, agent, other));
  }

  // Private methods

  _buildLog(ini, message, agent, other){
    try{
      if(!message) throw new Error('Missing message...');
      var aux = typeof message === 'object' ? JSON.stringify(message) : message;
      var date = new Date();
      var duration = date.getTime() - ini.getTime();
      aux = typeof agent !== 'undefined' ? agent + " - " + aux : "Unknown" + " - " + aux;
      aux = date.toISOString() + " - " + aux;
      aux = aux + " - " + duration + "ms";
      if(typeof other === 'object'){
        return aux + this._goThroughObject(other);
      } else if(typeof other === 'string'){
        return aux + " - " + other;
      } else {
        return aux;
      }
    } catch(err) {
      return err;
    }
  }

  _goThroughObject(other){
    var aux = "";
    for(var i in other){
      aux = aux + " - " + i + " : " + other[i];
    }
    return aux;
  }

}






/**
 * logger.js
 * Class that helps building logs
 * Singleton pattern
 * @class
 */

const logger = require('../_utils/logger');
const node_environment = process.env.NODE_ENV || 'development';

module.exports = class Log {
  constructor() {
    if(!Log.instance){
      this.ini = new Date();
      Log.instance = this;
    }
    return Log.instance;
  }

  // Methods

  /**
   * debug method
   * @param {STRING} message MANDATORY
   * @param {STRING} agent OPTIONAL (Part of the code reporting the log)
   * @param {*} other OPTIONAL (Additional fields)
   */
  debug(message, agent, other) {
    if(node_environment !== 'production') logger.debug(this._buildLog(message, agent, other));
  }

  /**
   * info method
   * @param {STRING} message MANDATORY
   * @param {STRING} agent OPTIONAL (Part of the code reporting the log)
   * @param {*} other OPTIONAL (Additional fields)
   */
  info(message, agent, other) {
    logger.info(this._buildLog(message, agent, other));
  }

  /**
   * warn method
   * @param {STRING} message MANDATORY
   * @param {STRING} agent OPTIONAL (Part of the code reporting the log)
   * @param {*} other OPTIONAL (Additional fields)
   */
  warn(message, agent, other) {
    logger.warn(this._buildLog(message, agent, other));
  }

  /**
   * error method
   * @param {STRING} message MANDATORY
   * @param {STRING} agent OPTIONAL (Part of the code reporting the log)
   * @param {*} other OPTIONAL (Additional fields)
   */
  error(message, agent, other) {
    if(message) logger.error(this._buildLog(message, agent, other));
  }

  // Private methods (Private methods and variables in NodeJS are still not in definitive version !!)

  _buildLog(message, agent, other){
    try{
      let aux;
      // Check if error obj
      aux = message.stack ? message.stack : message;
      // If not error but is obj parse, if not obj return as is
      aux = typeof aux === 'object' ? JSON.stringify(aux) : aux;
      let date = new Date();
      // var duration = date.getTime() - this.ini.getTime();
      aux = typeof agent !== 'undefined' ? agent + " - " + aux : "Unknown" + " - " + aux;
      aux = date.toISOString() + " - " + aux;
      // aux = aux + " - " + duration + "ms";
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
    let aux = "";
    for(let i in other){
      aux = aux + " - " + i + " : " + other[i];
    }
    return aux;
  }

}






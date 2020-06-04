/**
 * timer.js
 * Support to send events or collect properties
 * Uses the NodeJS built in timer
 * @class
 */

const timerInterval = process.env.SERVER_TIMER_INTERVAL || 90000;

 module.exports = class customTimer{

    constructor() {}

    start(){
        this.collectTimer = setInterval(this._action, timerInterval);
    }

    stop(){
        clearInterval(this.collectTimer);
    }

    // Private functions

    /**
     * Define some activity that needs to be repeated in intervals of time
     */
    _action(){}

}
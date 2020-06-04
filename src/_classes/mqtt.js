/**
 * mqtt.js
 * Supports connections to mqtt servers
 * @class
 */

let mqtt_package = require("mqtt");

 module.exports = class MQTT{

    constructor(host, username, password) {
        this.options = {};
        this.options.host = host;
        this.options.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        this.options.username = username;
        this.options.password = password;
        this.options.keepalive = 60;
        this.options.reconnectPeriod = 1000;
        this.options.protocolId = 'MQIsdp';
        this.options.protocolVersion = 3;
        this.options.clean = true;
        this.options.encoding = 'utf8';
        this._mqttItems = []; // List of registered items [{name: "", oid: ""}]
        this._mqttTopics = []; // List of topics listening [{event: "", topic: ""}]
    }

    connect(){
        return new Promise((resolve, reject) => {
            try{
                this.client = mqtt_package.connect(this.options.host, this.options);
                resolve(this.client);
            } catch(err) {
                reject(err);
            }
        });   
    }

    disconnect(){
        this.client.end();
        this._mqttTopics = [];
        this._mqttItems = [];
    }

    /**
     * Subscribes and stores in a run time array the new topic if it is not subscribed yet
     * @param {Object} data 
     */
    subscribe(data){
        let exists =  this._mqttTopics.findIndex((it) => {return it.topic === data.topic}) !== -1;
        let event =  data.event || null;
        if(!exists && event){
            this.client.subscribe(data.topic);
            this._mqttTopics.push(data); // Adds new topic and event associated to array
        } else {
            if(!event){ throw 'You need to define an event for the topic'; }
            else { throw 'Topic is already subscribed';  }
        }
    }

    /**
     * Unsubscribes a topic and removes it from the array of topics loaded in memory
     * @param {String} topic 
     */
    unsubscribe(topic){
        this.client.unsubscribe(topic);
        let index = this._mqttTopics.findIndex((it) => {return it.topic === topic});
        if(index !== -1){
            this._mqttTopics.splice(index, 1); // Removes unsubscribed topic form array
        } else {
            throw 'Topic was not found'
        }
    }

    // getters and setters

    get mqttItems(){
        return this._mqttItems;
    }

    set mqttItems(x){
        // Add new record only if the item name does not exist 
        let exists =  this._mqttItems.findIndex((it) => {return it.name === x.name}) !== -1;
        if(!exists){
            this._mqttItems.push(x);
        } 
    }

    get mqttTopics(){
        return this._mqttTopics;
    }

    set mqttTopics(x){
        this._mqttTopics.push(x);
    }
}
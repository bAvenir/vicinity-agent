/* Makes available the interfaces to the bAvenir agent resources */

const gateway = require('./src/_agent/gatewayInterface');
const services = require('./src/_agent/interface');
const persistance = require('./src/_persistance/interface');
const redis = require('./src/_persistance/_modules/redis');
let classes = {};
classes.timer =  require('./src/_classes/timer');
classes.mqtt =  require('./src/_classes/mqtt');
classes.logger =  require('./src/_classes/logger');
classes.request =  require('./src/_classes/request');
let utils = {};
utils.errorHandler = require('./src/_utils/errorHandler');
utils.logger = require('./src/_utils/logger');
let api = {};
api.admin = require('./src/_api/routes');
api.agent = require('./src/_agent/_api/routes');

// Public Functions
module.exports = {
  services: services,
  gateway: gateway,
  persistance: persistance,
  redis: redis,
  classes: classes,
  utils: utils,
  api: api
};
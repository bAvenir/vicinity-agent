const redis = jest.genMockFromModule('redis');

let createClient = function(){
    return { 
        ping: (cb) =>{ cb(false, 'OK'); },
        save: (cb)=>{ cb(false, true); },
        get: (a, cb)=>{ cb(false, 'string'); },
        set: (a, b, cb)=>{ cb(false, true); },
        del: (a, cb)=>{ cb(false, true); },
        hget: (a, b, cb)=>{ cb(false, 'string'); },
        hdel: (a, b, cb)=>{ cb(false, true); },
        hset:  (a, b, c, cb)=>{ cb(false, true); },
        hgetall:  (a, cb)=>{ cb(false, {test: true}); },
        hexists: (a, b, cb)=>{ cb(false, true); },
        scard:  (a, cb)=>{ cb(false, 2); },
        sadd:  (a, b, cb)=>{ cb(false, true); },
        srem:  (a, b, cb)=>{ cb(false, true); },
        sismember:  (a, b, cb)=>{ cb(false, false); },
        smembers: (a, cb)=>{ cb(false, ['a','b']); }
    }
}

redis.createClient = createClient;

module.exports = redis;
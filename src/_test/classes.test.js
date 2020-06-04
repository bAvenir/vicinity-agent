// Importing files to be tested
const resp = require("../_classes/response");
const myTimer = require("../_classes/timer");
const Request = require('../_classes/request');
const Mqtt = require('../_classes/mqtt');

// Mocking functions
jest.mock('got');
jest.mock('mqtt', () => ({
    connect: jest.fn( ()=> { return { subscribe: jest.fn() } })
}));

// Start testing

describe("request.js", () => {
    it("Check request misses uri", () => {
        const req = new Request();
        return req.send(null,null)
        .catch(err => {
            expect(err).toEqual(new Error('Missing URI'));
        });
    });
    it("Success sending request", () => {
        const req = new Request();
        req.setUri("http://", "fake");
        req.setMethod("POST");
        req.setBody({a:1});
        return req.send()
        .then(response => {
                expect(response).toEqual(undefined);
            } 
        );
    });
});

describe("response.js", () => {
    it("Check response is an object", () => {
        expect(new resp(200, "Hello")).toMatchObject({
            error: expect.any(Boolean),
            status: expect.any(Number),
            message: expect.any(String),
            success: expect.any(Boolean)
      })
    });
});

jest.useFakeTimers();
describe("timer.js", () => {
    it("Timer class starts timer and ends it", () => {
        const newTimer = new myTimer();
        newTimer.start();
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), "90000");
        newTimer.stop();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
});

describe("mqtt.js", () => {
    it("Subscribe fails - Event missing", () => {
        let mymqtt = new Mqtt('a','b','c');
        mymqtt.connect();
        expect(()=>mymqtt.subscribe({topic: "a"})).toThrow('You need to define an event for the topic');
    });
    it("Subscribe fails - Topic already subscribed", () => {
        let mymqtt = new Mqtt('a','b','c');
        return mymqtt.connect().then(()=> {
            mymqtt.subscribe({topic: "a", event: "b"});
            expect(()=>mymqtt.subscribe({topic: "a", event: "b"})).toThrow('Topic is already subscribed');
        })
    });
    it("Create array of topics", () => {
        let mymqtt = new Mqtt('a','b','c');
        let obj = {topic: '1', event: '2'};
        mymqtt.mqttTopics = obj;
        expect(mymqtt.mqttTopics).toMatchObject([obj]);
    });
    it("Create array of items", () => {
        let mymqtt = new Mqtt('a','b','c');
        let obj = {name: '1', oid: '2'};
        mymqtt.mqttItems = obj;
        expect(mymqtt.mqttItems).toMatchObject([obj]);
    });
});



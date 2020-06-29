let agent = require('../_agent/services');

// Mocks
// Redis is mocked manually in ./__mocks__/
// fs is mocked manually in ./__mocks__/
// got is mocked manually in ./__mocks__/
jest.mock('redis');
jest.mock('fs');
jest.mock('got');

describe("Agent Services", () => {
    it("Do logins", async () => {
        let spy = jest.spyOn(agent, 'doLogins');
        let response = await agent.doLogins(["1", "2", "3"]);
        expect(spy).toHaveBeenCalled();
        expect(response).toEqual("All logins finalized");
        
    });
    it("Do logouts", async () => {
        let spy = jest.spyOn(agent, 'doLogouts');
        let response = await agent.doLogouts(["1", "2", "3"]);
        expect(spy).toHaveBeenCalled();        
        expect(response).toEqual("Logouts were successful");
    });
    it("compareLocalAndRemote", async () => {
        let spy = jest.spyOn(agent, 'compareLocalAndRemote');
        let response_error = await agent.compareLocalAndRemote(["1", "2", "3"], [ { id: {info: {oid: "1"}} } , { id: {info: {oid: "2"}} }]);
        expect(response_error).toEqual(false);
        let response_ok = await agent.compareLocalAndRemote(["1", "2"], [ { id: {info: {oid: "1"}} } , { id: {info: {oid: "2"}} }]);
        expect(response_ok).toEqual(true);
        expect(spy).toHaveBeenCalledTimes(2);        
    });
    it("Activate Event Channels", async () => {
        let spy = jest.spyOn(agent, 'doLogouts');
        let response = await agent.doLogouts(["1", "2", "3"]);
        expect(spy).toHaveBeenCalled();        
        expect(response).toEqual("Logouts were successful");
    });
    it("subscribeEvents", async () => {
        let spy = jest.spyOn(agent, 'subscribeEvents');
        let response = await agent.subscribeEvents("1", ["1", "2", "3"]);
        expect(spy).toHaveBeenCalled();        
    });
    it("unsubscribeEvents", async () => {
        let spy = jest.spyOn(agent, 'unsubscribeEvents');
        let response = await agent.unsubscribeEvents("1", ["1", "2", "3"]);
        expect(spy).toHaveBeenCalled();        
    });
});
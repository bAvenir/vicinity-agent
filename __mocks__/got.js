const got = jest.genMockFromModule('got');

module.exports = async function(a, b) {
    console.log(`Testing request to URI: ${a}`);
    let response = responses[b.method + a];
    if(!response) response = { 'body': '{"test": true}' };
    return Promise.resolve(response);
}

let responses = {
    'GEThttp://localhost:8181/api/agents/undefined/objects' : { 'body': '{ "payload": {"message": true} }' },
    'POSThttp://localhost:8181/api/agents/undefined/objects': { 'body': '{"message": [ { "oid": "fakeoid", "password": "fakepwd" } ]}' },
    'POSThttp://localhost:8181/api/agents/undefined/objects/delete' : { 'body': '{ "message": {"message": "fakeOid"} }' }
}
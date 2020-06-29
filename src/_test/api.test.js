let request = require('supertest');

// jest.setup.js
jest.setTimeout(5000)

// Mocks
// Redis is mocked manually in ./__mocks__/
// fs is mocked manually in ./__mocks__/
// got is mocked manually in ./__mocks__/
jest.mock('redis');
jest.mock('fs');
jest.mock('got');

describe('Test admin and agent APIs endpoints', function () {
  // Set up
  let server;
  beforeEach(function () {
    server = require('./testserver.js');
  });
  afterEach(function () {
    server.close();
  });

  // Start ADMIN test suite

  it('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  it('Test /healthcheck', (done) => {
    request(server)
      .get('/admin/healthcheck')
      .expect(200, done);
    });
  it('Test GET /registrations', (done) => {
    request(server)
      .get('/admin/registrations')
      .expect(200, {error: false, message: ['a','b'] }, done);
    });
  it('Test GET /registrations/id', (done) => {
    request(server)
      .get('/admin/registrations/id')
      .expect(200, {error: false, message: {test: true} }, done);
    });
  it('Test GET /properties', (done) => {
    request(server)
      .get('/admin/properties')
      .expect(200, {error: false, message: ['a','b'] }, done);
    });
  it('Test GET /properties/id', (done) => {
    request(server)
      .get('/admin/properties/id')
      .expect(200, {error: false, message: 'string'}, done);
    });
  it('Test FAILS POST /properties/id', (done) => {
    request(server)
      .post('/admin/properties')
      .expect(200, {error: false, message: 'Problem adding, please check logs'}, done);
    });
  it('Test POST /properties', (done) => {
    request(server)
      .post('/admin/properties')
      .send({pid: 'someproperty', monitors: 'something'})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { error: false, message: 'Success' }, done);
    });
    it('Test DELETE /properties/id', (done) => {
      request(server)
        .delete('/admin/properties/id')
        .expect(200, {error: false, message: true}, done);
      });
    it('Test GET /events', (done) => {
      request(server)
        .get('/admin/events')
        .expect(200, {error: false, message: ['a','b'] }, done);
      });
    it('Test GET /events/id', (done) => {
      request(server)
        .get('/admin/events/id')
        .expect(200, {error: false, message: 'string'}, done);
      });
    it('Test POST /events', (done) => {
      request(server)
        .post('/admin/events')
        .send({eid: 'someproperty', monitors: 'something'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { error: false, message: 'Success' }, done);
      });
    it('Test DELETE /events/id', (done) => {
      request(server)
        .delete('/admin/events/id')
        .expect(200, {error: false, message: true}, done);
      });
    it('Test GET /actions', (done) => {
      request(server)
        .get('/admin/actions')
        .expect(200, {error: false, message: ['a','b'] }, done);
      });
    it('Test GET /actions/id', (done) => {
      request(server)
        .get('/admin/actions/id')
        .expect(200, {error: false, message: 'string'}, done);
      });
    it('Test POST /actions', (done) => {
      request(server)
        .post('/admin/actions')
        .send({aid: 'someproperty', affects: 'something'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { error: false, message: 'Success' }, done);
      });
    it('Test DELETE /actions/id', (done) => {
      request(server)
        .delete('/admin/actions/id')
        .expect(200, {error: false, message: true}, done);
      });
    it('Test GET /import/registrations', (done) => {
      request(server)
        .get('/admin/import/registrations')
        .expect(200, {error: false, message: 'DONE' }, done);
      });
    it('Test GET /import/properties', (done) => {
      request(server)
        .get('/admin/import/properties')
        .expect(200, {error: false, message: 'DONE' }, done);
      });
  it('Test GET /import/events', (done) => {
    request(server)
      .get('/admin/import/events')
      .expect(200, {error: false, message: 'DONE' }, done);
    });
  it('Test GET /import/actions', (done) => {
    request(server)
      .get('/admin/import/actions')
      .expect(200, {error: false, message: 'DONE' }, done);
    });
    it('Test GET /export/registrations', (done) => {
      request(server)
        .get('/admin/export/registrations')
        .expect(200, {error: false, message: 'DONE' }, done);
      });
    it('Test GET /export/properties', (done) => {
      request(server)
        .get('/admin/export/properties')
        .expect(200, {error: false, message: 'DONE' }, done);
      });
  it('Test GET /export/events', (done) => {
    request(server)
      .get('/admin/export/events')
      .expect(200, {error: false, message: 'DONE' }, done);
    });
    it('Test GET /export/actions', (done) => {
      request(server)
        .get('/admin/export/actions')
        .expect(200, {error: false, message: 'DONE' }, done);
      });
  it('Test GET /configuration', (done) => {
    request(server)
      .get('/admin/configuration')
      .expect(200, {error: false, message: {test: true} }, done);
    });

  // Start AGENT test suite

  it('Test GET /login', (done) => {
  request(server)
    .get('/agent/login')
    .expect(200, {error: false, message: "Login successful"}, done);
  });
  it('Test GET /logout', (done) => {
      request(server)
        .get('/agent/logout')
        .expect(200, {error: false, message: "Logout successful"}, done);
  });
  it('Test GET /registration', (done) => {
    request(server)
      .get('/agent/registration')
      .expect(200, {error: false}, done);
  });
  it('Test POST /registration MISS name', (done) => {
    request(server)
      .post('/agent/registration')
      .send({"type":"core:Service","adapterId":"a1233"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { error: true, message: 'Something went wrong, check the logs for more info' }, done);
    });
  it('Test POST /registration', (done) => {
    request(server)
      .post('/agent/registration')
      .send({"type":"core:Service","name":"TEST_SERVICE","adapterId":"a1233"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { error: false, message: [ { oid: 'fakeoid', password: 'fakepwd' } ] }, done);
    });
    it('Test DELETE /registration', (done) => {
      request(server)
        .post('/agent/registration/remove')
        .send({"oids":["fakeOid"]})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { error: false, message: 'fakeOid' }, done);
    });
    it('Test GET /discovery', (done) => {
      request(server)
        .get('/agent/discovery')
        .expect(200, {error: false, message: { test: true }}, done);
    });
  it('Test GET /property', (done) => {
    request(server)
      .get('/agent/properties/someoid/properties/someproperty')
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test PUT /property MISS Body', (done) => {
    request(server)
      .put('/agent/properties/someoid/properties/someproperty')
      .expect(400, {error: true, message: "Missing body"}, done);
  });
  it('Test PUT /property', (done) => {
    request(server)
      .put('/agent/properties/someoid/properties/someproperty')
      .send({"test":"fakeBody"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test POST /event-channel', (done) => {
    request(server)
      .post('/agent/events/local/someoid/someevent')
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test PUT /publish-event MISS Body', (done) => {
    request(server)
      .put('/agent/events/local/someoid/someevent')
      .expect(400, {error: true, message: "Missing body"}, done);
  });
  it('Test PUT /publish-event', (done) => {
    request(server)
      .put('/agent/events/local/someoid/someevent')
      .send({"test":"fakeBody"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test DELETE /event-channel', (done) => {
    request(server)
      .delete('/agent/events/local/someoid/someevent')
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test GET /event-channel-status', (done) => {
    request(server)
      .get('/agent/events/remote/myoid/someoid/someevent')
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test POST /event-channel-subscribe', (done) => {
    request(server)
      .post('/agent/events/remote/myoid/someoid/someevent')
      .expect(200, {error: false, message: { test: true }}, done);
  });
  it('Test DELETE /event-channel-subscribe', (done) => {
    request(server)
      .delete('/agent/events/remote/myoid/someoid/someevent')
      .expect(200, {error: false, message: { test: true }}, done);
  });
});

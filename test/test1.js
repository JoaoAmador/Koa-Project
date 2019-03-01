
/*
 see: https://github.com/koajs/examples

 https://www.codementor.io/olatundegaruba/integration-testing-supertest-mocha-chai-6zbh6sefz

 Use packages:

"mocha": "^5.2.0",

"should": "^13.2.3",  optional !

"chai": "^4.1.2",
"supertest": "^3.1.0"

"test": "NODE_ENV=test mocha -timeout 10000"


npm install supertest mocha chai --save-dev

mocha \
    --reporter spec \
    --require should \
        test/*.js

----

  request
   .get('/search')
   .query({ query: 'Manny' })
   .query({ range: '1..5' })
   
   By default sending strings will set the Content-Type to application/x-www-form-urlencoded
  request.post('/user')
    .auth('tobi', 'learnboost')
    .send('name=tj')
    .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .expect(function(res) {
        res.body.id = 'some fixed id';
        res.body.name = res.body.name.toUpperCase();
    })
    .expect(200, {
        id: 'some fixed id',
        name: 'john'
    }, done);
-----
mocha testfile.js --reporter mochawesome
*/

const app = require('../server');

let server, request;


describe('Testing app APIs', function() {
  before(function() {
    server = app.listen();
    request = require('supertest').agent(server);
  });
  
  after(function() {
    server.close();
  });


  describe('with Post JSON request', function() {
      it('should work', function(done) {
        request
            .post('/api/uppercase')
            //.set('Content-Type', 'application/json')
            .set('API-Key', 'foobar')
            .set('Accept', 'application/json')
            .send({ name: 'tobi' })
            .expect(200)
            .expect('Content-Type', /json/)  // Content-Type: application/json; charset=utf-8
            .expect({ name: 'TOBI' })  //, done);
            .end( function(err,res){
                 if (err) return done(err);
                 console.log('got body.name:',res.body.name,res.headers);
                 done();
            });
        
      });
  });
});

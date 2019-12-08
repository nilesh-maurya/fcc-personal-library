/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let id;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: "jungle book"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, '_id', "book should contain _id property.");
            assert.property(res.body, 'title', "book should contain title property");
            assert.equal(res.body.title, 'jungle book');
            id = res.body._id;
            done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title : ''})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "No title is entered! Please enter the title field.");
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array.");
            res.body.forEach(book => {
              assert.isObject(book, "book should be an object");
              assert.property(book, '_id', "book should contain _id property.");
              assert.property(book, 'title', "book should contain title property.");
              assert.property(book, 'commentcount', "book should contain commentcount");
            });
            done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get(`/api/books/5acb23778787656`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "the response should be an object");
            assert.property(res.body, '_id', "Book should contain an _id property.");
            assert.property(res.body, 'title', "Book should contain an title property.");
            assert.property(res.body, 'comments', "Book should contain comments property.");
            assert.isArray(res.body.comments, "comments property of book should be an array.");
            assert.equal(res.body._id, id);
            done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({ comment: "Interesting book"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response shouls be an object");
            assert.property(res.body, '_id', "book should contain _id property");
            assert.property(res.body, 'title', "book should contain title property");
            assert.property(res.body, 'comments', "book should contain comment property");
            assert.isArray(res.body.comments, "the comments property should be an Array");
            assert.equal(res.body._id, id);
            assert.include(res.body.comments, "Interesting book", "comments array includes the value");
            done();
        })
      });
      
    });

  });

});

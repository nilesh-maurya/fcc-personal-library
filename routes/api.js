/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useFindAndModify: false});

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String]
});

const Book = mongoose.model('Book', bookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      // Find all the books
      Book.find({}).then(books => {
        const result = books.map(book => {
          return { _id: book._id, title: book.title, commentcount: book.comments.length };
        });
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        res.json(result);
      }).catch(err => {
        throw new Error(err);
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(!title){
        return res.send("No title is entered! Please enter the title field.");
      }
      
      new Book({ title }).save().then(book => {
        res.json(book);
      }).catch(err => {
        throw new Error(err);
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.remove({}).then(deletedBook => {
        console.log(deletedBook);
        res.send("complete delete successful");
      }).catch(err => {
        throw new Error(err);
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById({_id: bookid}).then(book => {
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          res.json(book);
      }).catch(err => {
        res.send("no book exists");
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate({_id: bookid }, {$push: { comments: comment }}, {new: true}).then(book => {
        res.json(book);
      }).catch(err => {
        res.send("no book exists");
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findByIdAndRemove({_id: bookid }).then(deletedBook => {
        //if successful response will be 'delete successful'
        res.send("delete successful");
      }).catch(err => {
        res.send("no book exists");
      });
    });
  
};

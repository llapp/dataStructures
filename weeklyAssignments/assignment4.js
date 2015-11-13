// ---------------------------------
// weekly assignment 4 - Linnea Lapp
// 10-05-2015
// ---------------------------------

// Commands in the MongoDB shell: 
//      use aa
//      db.createCollection('meetings_area2')

var request = require('request'); // npm install request
var fs = require('fs'); // npm install fs

// Connection URL
var url = 'mongodb://localhost:27017/aa';

var meetingInfo = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/assignment3_data.txt'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
    
  // if there was an error, print error
  assert.equal(null, err);
  
  // confirm successful connection to server
  console.log("Connected correctly to server");
 
  insertDocuments(db, function() {
    
    // close connection
    db.close();
  });
});

// function to insert info into documents, and documents into collection
var insertDocuments = function(db, callback) {
  // get the documents collection 
  var collection = db.collection('meetings_area2');
  // insert info from meetingsInfo to document collection
  collection.insert(
    meetingInfo, function(err, result) {
    assert.equal(err, null);
    assert.equal(meetingInfo.length, result.result.n);
    assert.equal(meetingInfo.length, result.ops.length);
    console.log("Inserted " + meetingInfo.length +" documents into the document collection");
    callback(result);
  });
};
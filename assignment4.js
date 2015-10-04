// IN THE MONGO SHELL: 
//   CREATE DATABASE aa AND SWITCH TO IT WITH: 
//      use aa
//   CREATE COLLECTION meetings_area2 WITH: 
//      db.createCollection('meetings_area2')

var request = require('request');
var fs = require('fs');

    // Connection URL
    // Give the URL for the mongo database
    var url = 'mongodb://localhost:27017/aa';
   
    var meetingInfo = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/assignment3_data.txt'));

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb
    
    // db = connection to the databas (if there is one)
    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection('meetings_area2');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        // inserting each i from the stationBeanList array into the database
        // can insert just an array of objects without using a for loop
        for (var i=0; i < meetingInfo.length; i++) {
            collection.insert(meetingInfo[i]);
            console.log("Inserted " + meetingInfo.length +" documents into the document collection");
            }
        db.close();

    }); //MongoClient.connect

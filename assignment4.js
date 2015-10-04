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

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb
    
    // db = connection to the databas (if there is one)
    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection('meetings_area2');

        // Insert info from meetingInfo to the documents collection 'meetings_area2'
        for (var i=0; i < meetingInfo.length; i++) {
            collection.insert(meetingInfo[i]);
            console.log("Inserted " + meetingInfo.length +" documents into the document collection");
            }
        db.close();

    });

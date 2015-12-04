// --------------------------------------------------------
//
// Final Project 1 -- insert meeting objects into Mongo
//
// --------------------------------------------------------

var fs = require('fs');
var collName = 'manhattanMeetings';

var meetingObjectArray = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/meetingObjectArray.txt'));
// console.log(meetingObjectArray);
var url = 'mongodb://localhost:27017/aa';

var MongoClient = require('mongodb').MongoClient;

function mongoIt () {
    MongoClient.connect(url, function(err, db) {
        
        if (err) {return console.dir(err);}
    
        var collection = db.collection(collName);
    
            // WRITE TO MONGO
            collection.insert(meetingObjectArray);
    
        db.close();
    
    }); //MongoClient.connect
}

setTimeout(mongoIt, 200);



// -------------------------------------------------------------------------
//
// Final Project 1 -- connect the MongoDB query output to Google Maps API
//
// -------------------------------------------------------------------------


var http = require('http');
process.env.TZ = 'America/New_York';

var fs = require('fs');

var data1 = fs.readFileSync(__dirname + '/firstChunk.html');
var data3 = fs.readFileSync(__dirname + '/thirdChunk.html');

var server = http.createServer(function(req, res) {

var collName = 'manhattanMeetings';

var currentDate = new Date(); // Pull current date info
var todayNum = currentDate.getDay(); // Pull out numeric weekday -- same as dayNum variable in meeting objects
var currentHour = currentDate.getHours(); // Pull out current hour -- in military time
var endHour = 4; // Query for meetings with start times up to 4AM 

var tomorrowNum = getTomorrow(todayNum);

// Add 1 to todayNum to get tomorrowNum -- if it's Saturday, return 0 for Sunday
function getTomorrow(todayNum){
    if (todayNum < 6){
        return todayNum + 1;
    } else if (todayNum == 6) {
        return 0;
    }
}

// Connection URL
var url = 'mongodb://localhost:27017/aa';

// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
    if (err) {
        return console.dir(err);
    }

    var collection = db.collection(collName);

    collection.aggregate( [

        { $unwind : "$eachMeeting" },
        
        { $match: {
        
            $or: [{
        
                $and: [{ "eachMeeting.meetingDayNum": todayNum },
                { "eachMeeting.meetingStartHour": { $gt: currentHour, $lt: 25 } } 
                ]},
        
                { $and: [{ "eachMeeting.meetingDayNum": tomorrowNum },
                { "eachMeeting.meetingStartHour": { $gt: -1, $lt: endHour } } 
                ]}
            ]}},
        
        { $group : {  _id : { 
            meetingName : "$meetingName",
            meetingLocation : "$meetingLocation",
            cleanAddress : "$cleanAddress",
            directions : "$directions",
            details : "$details",
            meetingAccess : "$meetingAccess",
            latLong : "$latLong"
        }, 
            meetingDay : { $push : "$eachMeeting.meetingDay" },
            meetingDayNum : { $push : "$eachMeeting.meetingDayNum" },
            meetingStartHour : { $push : "$eachMeeting.meetingStartHour" },
            meetingStartTime : { $push : "$eachMeeting.meetingStartTime" },
            meetingType : { $push : "$eachMeeting.meetingType" },
            specialInterest : { $push : "$eachMeeting.specialInterest" }
        }},
        
        { $group : { _id : { latLong : "$_id.latLong" }, 
                    meetingGroups : { $addToSet : {  meetingGroup : "$_id", 
                                                meetings : {
                                                meetingDays : "$meetingDay",
                                                meetingDayNums : "$meetingDayNum",
                                                meetingStartHours : "$meetingStartHour",
                                                meetingStartTimes : "$meetingStartTime",
                                                meetingTypes : "$meetingType",
                                                specialInterest : "$specialInterest"
                                                }
                    } }
                    } }
        
         ]).toArray(function(err, docs) {
        if (err) {console.log(err);}
        else {
            
            res.write(data1);
            res.write('var meetings = ' + JSON.stringify(docs) + ';');
            res.write(data3);
            res.end();
            
        }
        db.close();
        
    });

}); //MongoClient.connect

}); 

server.listen(process.env.PORT);

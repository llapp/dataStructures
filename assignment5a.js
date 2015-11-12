// ---------------------------------
//
// weekly assignment 5 - Linnea Lapp
//
// ---------------------------------

var request = require('request');
var async = require('async');
var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var url = 'mongodb://localhost:27017/aameetings';

var apiKey = process.env.API_KEY;

var content = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');
// var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=02&borough=M";

var meetingInfo = [];
var roughMeetingName = [];
var meetingName = [];
var roughMeetingLocation = [];
var meetingLocation = [];
var address = [];
var cleanAddress = [];
var meetingAddress = [];
var roughDetails = [];
var details = [];
var handicapAccess = [];
var meetingAccess = [];
var specialInterest = [];
var meetingDays = [];
var meetingStartTimes = [];
var meetingTypes = [];
var directions = [];
var dataLoaded = false;


// async.waterfall([

//         // check if mongo db is running
//         function(callback) {
//             // Use connect method to connect to the Server
//             MongoClient.connect(url, function(err, db) {
//                 // if there is a connection error print error
//                 assert.equal(null, err);
//                 // if we do tell us we have
//                 console.log("Connected correctly to server");
//                 db.close();
//                 callback(null);
//             });
//         },
//         // load aa page data from url variabl
//         function readAAPage(callback, body) {
//             request(aaPage, function(error, response, body) {
//                 if (error) {
//                     //if we cant tell us why
//                     console.log(error);
//                 }
//                 // 200 is the code that says everything is okay
//                 if (!error && response.statusCode == 200) {
//                     console.log("page retrieved");
//                 }
//                 callback(null, body);
//             });
//         },
//         // parse aa meeting data and add geo-coding
//         function parseData(body, callback) {
//             getMeetingInfo(body);

//             getAPIData();

//         }
//     ],
//         function(err, res) {
//         // feed results to mongo db
//         MongoClient.connect(url, function(err, db) {
//             // if there isn't a connection print error
//             assert.equal(null, err);
//             // log in console if you can connect to server
//             console.log("Connected correctly to server");

//             // insertDocuments(db, function() {

//             // close database connection
//             // db.close();
//             // });
//         });
//     });

// function getMeetingInfo(body) {
    
var $ = cheerio.load(content);

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem){
    // meeting names
    roughMeetingName.push($(elem).find('b').eq(0).text().replace(/\s+/g, '').trim());
    // console.log(roughMeetingName);
    
    // cleanMeetingName.push(fixMeetingNames(meetingName[i]));
    
    // location names -- need to get rid of "\'"
    roughMeetingLocation.push($(elem).find('h4').eq(0).text().replace(/\\/g, '').trim());
    // meetingLocation.push(fixLocationNames(roughMeetingLocation[i]));
    // console.log(roughMeetingLocation);
    
    // addresses
    address.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    cleanAddress.push(fixAddresses(address[i]));
    
    // special info -- need to get rid of "\'"
    roughDetails.push($(elem).find('.detailsBox').eq(0).text().replace(/\\/g, '').trim());
    details.push(boolean(roughDetails[i]));
    // console.log(details);
    
    handicapAccess.push($(elem).find('span').eq(0).text().trim());
    meetingAccess.push(boolean(handicapAccess[i]));
    // console.log(meetingAccess);
    
});
// }

// function getAPIData() {
//     // make sure all data has been loaded into arrays
//     if (!dataLoaded) {
//         console.log("data not loaded into arrays yet");
//     }
//     else if (dataLoaded) {

//         // make a variable to iterate through arrays
//         var i = 0;

//         // use async foreach to iterate through geocoded array
//         async.forEach(meetingAddress, function(value, callback) {
            
//             // plug in geocoded value into api request url
//             var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey;

//             // make request for lat and long data
//             request(apiRequest, function(err, resp, body) {
                
//                 // if there is an error
//                 if (err) {
//                     throw err;
//                 }

//                 if (JSON.parse(body).status == "ZERO_RESULTS") {
//                     console.log("ZERO RESULTS for" + value);
//                 }
//                 // else {
//                 //     //   test2.push(JSON.parse(body).results[0].geometry.location);
//                 //     obj.meetingLatLong = JSON.parse(body).results[0].geometry.location;
//                 //     meetingInfo.push(obj);
//                 //     console.log(obj);
//                 //     i++;
//                 // }
//             });
//             setTimeout(callback, 300);
//         }, 
//         function() {
//             // return meetingInfo;
//             // console.log(meetingInfo);
//             fs.writeFile('/home/ubuntu/workspace/data/t.txt', JSON.stringify(meetingInfo), function(err) {

//                 if (err)
//                     console.log('Error');
//                 console.log('Wrote ' + meetingInfo.length + ' entries to file ' + 'inclass4.txt');

//             });
//         });
//     }
//     dataLoaded = true;
// }


// functions to clean data _____________________________________________________

// function fixMeetingNames(roughMeetingNames) {
//     var second = roughMeetingNames.substr(roughtMeetingNames.indexOf('-') + 2);
//     var first = roughMeetingNames.substr(0, roughMeetingNames.indexOf('-') - 1);
    

//     if (first == second.toUpperCase()) {
//         meetingNames = first;
//     } else if (second == "") {
//         meetingNames = first;
//     } else {
//         meetingNames = second.toUpperCase();
//     }
//      return meetingNames;
//     }

function fixAddresses(oldAddress) {
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress; 
}

function boolean(value) {
    if (value == "") {
        return "";
    } else {
        return value;
    }
}

// function fixLocationNames (text) {
//     var t = text; 
//     t = t.replace(/\\/g, "");
//     // console.log(t);
//     return t; 
// }
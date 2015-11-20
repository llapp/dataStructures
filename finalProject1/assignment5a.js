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

var content = fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/aa02.txt');
// var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=02&borough=M";

var meetingInfo = []; 
var roughMeetingName = [];
var meetingName = []; //done
var roughMeetingLocation = [];
var meetingLocation = []; //done, need to remove backslashes
var address = [];
var cleanAddress = []; //done
var directions = []; //done
var roughDetails = [];
var details = []; //done, need to remove backslashes
var handicapAccess = [];
var meetingAccess = []; //done
var specialInterest = [];
// var roughMeetingDays = [];
// var meetingDays = [];
var day = [];
var hoursColumn = [];
// var roughMeetingStartTime = [];
// var meetingStartTime = [];
var meetingType = [];
var roughDirections = [];
var eachMeeting = [];
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
    
    // MEETING NAMES ----------------------------------------------------------------------------
    roughMeetingName.push($(elem).find('b').eq(0).text().replace(/\s+/g, ' ').trim());
    meetingName.push(fixMeetingNames(roughMeetingName[i]));
    // console.log(meetingName);
    
    // LOCATION NAMES ----------------------------------------------------------------------------
    roughMeetingLocation.push($(elem).find('h4').eq(0).text().replace(/\\/g, '').trim());
    meetingLocation.push(fixLocationNames(roughMeetingLocation[i]));
    // console.log(meetingLocation);
    
    // ADDRESS INFO ----------------------------------------------------------------------------
    address.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    cleanAddress.push(fixAddresses(address[i]));
    // console.log(cleanAddress);
    
    roughDirections.push($(elem).find('td').eq(0).html().split('<br>')[3].trim());
    directions.push(fixDirections(roughDirections[i]));
    // console.log(directions);
    
    // OTHER INFO ----------------------------------------------------------------------------
    roughDetails.push($(elem).find('.detailsBox').eq(0).text().replace(/\\/g, '').trim());
    details.push(boolean(roughDetails[i]));
    // console.log(details);
    
    handicapAccess.push($(elem).find('span').eq(0).text().trim());
    meetingAccess.push(boolean(handicapAccess[i]));
    // console.log(meetingAccess);
    
    // EACH MEETING INFO ----------------------------------------------------------------------------
    $(elem).find('td').eq(1).each(function(i, elem) {
            hoursColumn.push($(elem).contents().text().trim());
        });

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


// FUNCTIONS TO CLEAN INFO ----------------------------------------------------

// Clean addresses
function fixAddresses(oldAddress) {
    // want to get rid of anything in () before the comma
    // var start = oldAddress.substring(0, oldAddress.indexOf('('));
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress; 
}

// Clean directions 
function fixDirections(oldDirections) {
    // remove NY, zip and ()
    var newDirections = oldDirections.replace(/100\d\d$/,"").trim();
    newDirections = newDirections.replace("NY","").trim();
    newDirections = newDirections.replace(/^\(/,"");
    newDirections = newDirections.replace(/\)$/,"");

    return newDirections;
}

// If field is empty, return empty value
function boolean(value) {
    if (value == "") {
        return "";
    } else {
        return value;
    }
}

// Clean meeting location names
function fixLocationNames (text) {
    var t = text; 
    t = t.replace(/\\'/g, "'");
    // console.log(t);
    return t; 
}

// Clean meeting names
function fixMeetingNames(wholeName) {
    // var firstHalf = wholeName.substring(0,wholeName.indexOf('-'));
    // return firstHalf;
    var middle = wholeName.indexOf('-');
    var firstHalf = wholeName.toUpperCase().substring(0, middle).replace(/A.A./g, "AA").trim();
    var secondHalf = wholeName.toUpperCase().substring(middle + 2).replace(/- |-/g, "").trim();
    var firstHalfClean = firstHalf.replace(/\s/g, '');
    var secondHalfClean = secondHalf.replace(/\s/g, '');

    var compare = firstHalfClean.localeCompare(secondHalfClean);

    if (middle < compare && compare >= 4) {
        // console.log(">= 4" + wholeName.replace(/-/g, ' ').trim());
        return wholeName.replace(/-/g, ' ').trim();
    }
    else if (compare == middle - 3 || compare == 0 || secondHalfClean.length == 0 || firstHalfClean.indexOf("(:I") != -1) {
        // console.log("First return" + firstHalf.replace(/-/g, ' ').trim());
        return firstHalf.replace(/-/g, ' ').trim();
        // targets names with (:I) or (:II) after the name
    }
    else if (firstHalfClean == 0 || secondHalfClean.indexOf("(:I") != -1) {
        // console.log("second has #" + secondHalf.replace(/-/g, ' ').trim());
        return secondHalf.replace(/-/g, ' ').trim();
        // targets names with more then (:II) after the name
    }
    else if (compare < 0) {
        // console.log( "< 0" + firstHalf + ": " + secondHalf.substring(compare));
        return secondHalf.substring(compare);
        // targets names that match
    }
}
// // Clean days
// function fixDays(roughDays) {
//     var start = roughDays.indexOf('>');
//     var end = roughDays.indexOf(' From');
//     var cleanDays = roughDays.substring(start, end);
//     // console.log(cleanDays);
//     return cleanDays;
// }

// Clean hours
for (var i in hoursColumn) {
    hoursColumn[i] = hoursColumn[i].replace(/[ \t]+/g, " ");
    hoursColumn[i] = hoursColumn[i].replace(/[\r\n|\n]/g, " ");
    hoursColumn[i] = hoursColumn[i].split("           ");
    for (var k in hoursColumn[i]) {
        hoursColumn[i][k] = hoursColumn[i][k].trim();
    }
    // console.log(hoursColumn);
}

// Breakdown each meeting time into variables
function fixHours (roughHours) {
    var from = roughHours.indexOf(roughHours.match("From"));
    var startHour = roughHours.substr(from + 4, 2);
    var startMinute = roughHours.substr(from + 7, 2);
    
    // Find meeting start time
    startHour = parseInt(startHour);
    startMinute = parseInt(startMinute);

    // Find meeting Type
    if (roughHours.indexOf('Type') != -1) {
    meetingType = roughHours.substr(roughHours.indexOf(roughHours.match("Type")) + 5, 2);
    } else {
        meetingType = '';
    }
    
    // Find meeting Special Interest
    if (roughHours.indexOf('Interest') != -1) {
        specialInterest = roughHours.substr(roughHours.indexOf(roughHours.match("Interest")) + 9);
    } else {
        specialInterest = '';
    }
    
    // Find meeting Day
    day = roughHours.substr(0, from - 2);
    if (day == 'Sunday') {
        day = 1;
    } else if (day == 'Monday') {
        day = 2;
    } else if (day == 'Tuesday') {
        day = 3;
    } else if (day == 'Wednesday') {
        day = 4;
    } else if (day == 'Thursday') {
        day = 5;
    } else if (day == 'Friday') {
        day = 6;
    } else if (day == 'Saturday') {
        day = 7;
    }
    
    return {
        "meetingDay": day,
        "meetingStartHour": startHour,
        "meetingStartMin": startMinute,
        "meetingType": meetingType,
        "specialInterest": specialInterest
    };
}

// Push cleaned meeting time variables into object
for (var i in hoursColumn) {
    for (var k in hoursColumn[i]) {
        hoursColumn[i][k] = fixHours(hoursColumn[i][k]);
    }
    eachMeeting.push(hoursColumn[i]);
} 

console.log(eachMeeting);
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

var content = fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/allMeetingInfo.txt');
// var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=02&borough=M";

var meetingInfo = []; 
var roughMeetingName = [];
var roughMeetingLocation = [];
var address = [];
var roughDirections = [];
var roughDetails = [];
var handicapAccess = [];
var specialInterest = [];
var day = [];
var hoursColumn = [];
var meetingType = [];
// var roughMeetingDays = [];
// var meetingDays = [];
// var roughMeetingStartTime = [];
// var meetingStartTime = [];

var meetingName = []; //done, some undefined
var meetingLocation = []; //done, need to remove backslashes
var cleanAddress = []; //done, some extra info after street address should be removed
var directions = []; //done
var details = []; //done, need to remove backslashes
var meetingAccess = []; //done
var eachMeeting = []; // done
var latLong = []; // returning undefined
var allInfo = new Object;
var dataLoaded = false;

  
// BEGIN PARSING ----------------------------------------------------------------------------------
var $ = cheerio.load(content);

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem){
    
    // MEETING NAMES ----------------------------------------------------------------------------
    roughMeetingName.push($(elem).find('b').eq(0).text().replace(/\s+/g, ' ').trim());
    meetingName.push(fixMeetingNames(roughMeetingName[i]));
    allInfo.meetingName = meetingName;
    // console.log(meetingName);
    
    // LOCATION NAMES ----------------------------------------------------------------------------
    roughMeetingLocation.push($(elem).find('h4').eq(0).text().replace(/\\/g, '').trim());
    meetingLocation.push(fixLocationNames(roughMeetingLocation[i]));
    allInfo.meetingLocation = meetingLocation;
    // console.log(meetingLocation);
    
    // ADDRESS ----------------------------------------------------------------------------
    address.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    cleanAddress.push(fixAddresses(address[i]));
    allInfo.meetingAddress1 = cleanAddress;
    // console.log(cleanAddress);
    
    roughDirections.push($(elem).find('td').eq(0).html().split('<br>')[3].trim());
    directions.push(fixDirections(roughDirections[i]));
    allInfo.meetingAddress2 = directions;
    // console.log(directions);
    
    // OTHER INFO ----------------------------------------------------------------------------
    roughDetails.push($(elem).find('.detailsBox').eq(0).text().replace(/\\/g, '').trim());
    details.push(boolean(roughDetails[i]));
    allInfo.meetingDetails = details;
    // console.log(details);
    
    handicapAccess.push($(elem).find('span').eq(0).text().trim());
    meetingAccess.push(boolean(handicapAccess[i]));
    allInfo.meetingWheelchair = meetingAccess;
    // console.log(meetingAccess);
    
    // EACH MEETING INFO ----------------------------------------------------------------------------
    $(elem).find('td').eq(1).each(function(i, elem) {
            hoursColumn.push($(elem).contents().text().trim());
        });

});



// FUNCTIONS TO CLEAN INFO ----------------------------------------------------

// API get lat & long ----------------------------------------------------------------------------

function getLatLong() {
    
    var apiAddress = [];
    
    $('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {
        apiAddress.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
        // console.log(apiAddress[i]);
    });
    
async.eachSeries(apiAddress, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value).split(' ').join('+') + '&key=' + apiKey;
    // allInfo.meetingAddress1 = value;

    request(apiRequest, function(err, resp, body) {
        if (err) {
            throw err;
        }
        
        if (JSON.parse(body).status == "ZERO_RESULTS") {
            console.log("ZERO RESULTS for" + value);
        } else {
            latLong = JSON.parse(body).results[0].geometry.location;
            allInfo.meetingLatLong = latLong;
            // allInfo.meetingLatLong = JSON.parse(body).results[0].geometry.location;
            return allInfo.meetingLatLong;
        }

        // latLong.push(allInfo.meetingLatLong);
        // console.log(allInfo.meetingLatLong);

    setTimeout(callback, 500);
        
    });
});
// function() {
//     //console.log(meetingsData);
//     // fs.writeFileSync('./aaMeetingsArrayArea2.txt', JSON.stringify(allInfo));
// });
}
// console.log(getLatLong());

// Clean addresses
function fixAddresses(oldAddress) {
    // want to get rid of anything in () before the comma
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    // console.log(newAddress);
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

    var middle = wholeName.indexOf('-');
    var firstHalf = wholeName.toUpperCase().substring(0, middle).replace(/A.A./g, "AA").trim();
    var secondHalf = wholeName.toUpperCase().substring(middle + 2).replace(/- |-/g, "").trim();
    var firstHalfClean = firstHalf.replace(/\s/g, '');
    var secondHalfClean = secondHalf.replace(/\s/g, '');

    var compare = firstHalfClean.localeCompare(secondHalfClean);

    if (middle < compare && compare >= 4) {
        return wholeName.replace(/-/g, ' ').trim();
    }
    else if (compare == middle - 3 || compare == 0 || secondHalfClean.length == 0 || firstHalfClean.indexOf("(:I") != -1) {
        return firstHalf.replace(/-/g, ' ').trim();
        // targets names with (:I) or (:II) after the name
    }
    else if (firstHalfClean == 0 || secondHalfClean.indexOf("(:I") != -1) {
        return secondHalf.replace(/-/g, ' ').trim();
        // targets names with more then (:II) after the name
    }
    else if (compare < 0) {
        return secondHalf.substring(compare);
        // targets names that match
    }
}

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

allInfo.meetingTimes = eachMeeting;

console.log(allInfo.meetingTimes);
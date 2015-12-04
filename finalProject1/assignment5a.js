// ----------------------------------------------------
//
// Final Project 1 -- parse meeting info & save to txt file
//
// ----------------------------------------------------

var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var content = fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/allMeetingInfo.txt');
var latLongArray = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/allLatLongs.txt'));

var meetingInfo = []; // array of all meeting objects
var roughMeetingName = [];
var roughMeetingLocation = [];
var address = [];
var roughDirections = [];
var roughDetails = [];
var handicapAccess = [];
var specialInterest = [];
var day = [];
var dayNum = [];
var meetingType = [];
var roughHoursColumn = [];
var hoursColumn = [];
var eachMeeting = []; // done

  
// ------------------------------------- BEGIN PARSING ----------------------------------------------------------------------------------
var $ = cheerio.load(content);

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem){
    
    var thisObject = new Object;
    
    // MEETING NAMES ----------------------------------------------------------------------------
    roughMeetingName.push($(elem).find('b').eq(0).text().replace(/\s+/g, ' ').trim());
    thisObject.meetingName = fixMeetingNames(roughMeetingName[i]);
    // console.log(thisObject.meetingName);
    
    // LOCATION NAMES ----------------------------------------------------------------------------
    roughMeetingLocation.push($(elem).find('h4').eq(0).text().replace(/\\/g, '').trim());
    thisObject.meetingLocation = fixLocationNames(roughMeetingLocation[i]);
    // console.log(thisObject.meetingLocation);
    
    // ADDRESS ----------------------------------------------------------------------------
    address.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    thisObject.cleanAddress = fixAddresses(address[i]);
    // console.log(thisObject.cleanAddress);
    
    roughDirections.push($(elem).find('td').eq(0).html().split('<br>')[3].trim());
    thisObject.directions = fixDirections(roughDirections[i]);
    // console.log(thisObject.directions);
    
    // OTHER INFO ----------------------------------------------------------------------------
    roughDetails.push($(elem).find('.detailsBox').eq(0).text().replace(/\\/g, '').trim());
    thisObject.details = boolean(roughDetails[i]);
    // console.log(thisObject.details);
    
    handicapAccess.push($(elem).find('span').eq(0).text().trim());
    thisObject.meetingAccess = boolean(handicapAccess[i]);
    // console.log(thisObject.meetingAccess);
    
    // EACH MEETING INFO ----------------------------------------------------------------------------
    // create new object/array to hold each meeting time info, then push to big object
    $(elem).find('td').eq(1).each(function(i, elem) {
            roughHoursColumn.push($(elem).contents().text().trim());
            
    });
            hoursColumn.push(cleanHours(roughHoursColumn[i]));
            // console.log(hoursColumn.length);
            var test = makeEachMeeting(hoursColumn[i]);
            thisObject.latLong = latLongArray[i];
            thisObject.eachMeeting = eachMeeting[i];
            // console.log(thisObject);
        
        meetingInfo.push(thisObject);
        

});
// ------------------------------------- Done parsing ----------------------------------------------------


// ------------------------------------- FUNCTIONS TO CLEAN INFO -----------------------------------------

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
function cleanHours(theHours) {
    
    var theHours1 = theHours.replace(/[ \t]+/g, " ");
    var theHours2 = theHours1.replace(/[\r\n|\n]/g, " ");
    var theHours3 = theHours2.split("           ");
    for (var i in theHours3) {
        theHours3[i] = theHours3[i].trim();
    // console.log(theHours3[i]);
    }
    return theHours3;
    // console.log(hoursColumn);
}


// Breakdown each meeting time into variables
function fixHours (roughHours) {
    var from = roughHours.indexOf(roughHours.match("From"));
    
    var hr = roughHours.substr(from + 4, 3);
    hr = hr.replace(/:/g, '');
    hr = parseInt(hr);
    // console.log(hr);
    
    var startHour;
    
    var startTime = roughHours.substr(from + 4, 9);
    startTime = startTime.trim();
    // console.log(startTime);
    
    var m = startTime.substr(startTime.indexOf('M') - 1, 1);
    // console.log(m);
    
    // Convert start hour to military time
    if (m == 'A' && hr == 12) {
        startHour = 0;
    } else if (m == "A" && hr < 12) {
        startHour = parseInt(hr);
    } else if (m == "P" && hr == '12') {
        startHour = 12;
    } else if (m == "P" && hr < 12) {
        startHour = hr + 12;
    }
    // console.log(startHour);


    // Find meeting Type
    if (roughHours.indexOf('Type') != -1) {
    meetingType = roughHours.substr(roughHours.indexOf(roughHours.match("Type")) + 5, 2).trim();
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
    day = roughHours.substr(0, from - 1);
    if (day == 'Sundays') {
        day = 'Sundays';
        dayNum = 0;
    } else if (day == 'Mondays') {
        day = 'Mondays';
        dayNum = 1;
    } else if (day == 'Tuesdays') {
        day = 'Tuesdays';
        dayNum = 2;
    } else if (day == 'Wednesdays') {
        day = 'Wednesdays';
        dayNum = 3;
    } else if (day == 'Thursdays') {
        day = 'Thursdays';
        dayNum = 4;
    } else if (day == 'Fridays') {
        day = 'Fridays';
        dayNum = 5;
    } else if (day == 'Saturdays') {
        day = 'Saturdays';
        dayNum = 6;
    }
    // console.log(dayNum);
    
    return {
        "meetingDay": day,
        "meetingDayNum": dayNum,
        "meetingStartHour": startHour,
        "meetingStartTime": startTime,
        "meetingType": meetingType,
        "specialInterest": specialInterest
    };
}

// Push cleaned meeting time variables into object
function makeEachMeeting(hourColArray) {
    
for (var i in hourColArray) {
        hourColArray[i] = fixHours(hourColArray[i]);
    
}
    // console.log(eachMeeting);
    // return eachMeeting.push(hourColArray);
    eachMeeting.push(hourColArray);
    // console.log(eachMeeting[2]);
    return eachMeeting[i];
} 

// ------------------------------------- DONE CLEANING -------------------------------------------------

// ------------------------------------- WRITE RESULTS TO TXT FILE -------------------------------------------------


fs.writeFile('meetingObjectArray.txt', JSON.stringify(meetingInfo), function (err) { 
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + meetingInfo.length + ' entries to file');
        
    });

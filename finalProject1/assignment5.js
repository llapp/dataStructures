// ---------------------------------
// weekly assignment 5 - Linnea Lapp
// 10-19-2015
// ---------------------------------

// Parse each type of information for all meetings, save it to an array, then write it to a txt file
// FINAL FORMAT GOAL:
// {
// originalAddress: xxx,
// address: xxx,
// zip: xxxxx,
// times: { day: xxx,
//          type: xxx,
//          specialInterest: xxx,
//          startTime: xxx,
//          }
// accessibility: xxx,
// details: xxx,
// locationName: xxx,
// meetingName: xxx
// }

var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var content = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

var addresses = [];
var locationNames = [];
var meetingNames = [];
var details = [];
var weekday = [];


var $ = cheerio.load(content);

// Meeting address:
$('tbody').find('tr').each(function(i, elem){
        addresses.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    });
    
// Location/building names:
// ISSUE: '&apos ;' printing in place of apostrophe
$('tbody').find('tr').each(function(i, elem){
        locationNames.push($(elem).find('h4').html());
    });
        function fixLocationNames (text) {
    var t = text; 
    t = t.replace('&apos ;', "'");
    return t; 
}



// console.log(fixLocationNames(locationNames));



// // Meeting names:
// // Don't want what comes after the hyphen if what comes after is the same(ish)
// // Parse out the length of the string up to the hyphen, then compare that to the capitalized version of what comes after
$('tbody').find('tr').each(function(i, elem){
    var meetingNamesRough = [];
        meetingNamesRough.push($(elem).find('b').html());
        for (var i = 0; i < meetingNamesRough.length; i++) {
            meetingNames.push(((meetingNamesRough[i].substring(0, meetingNamesRough[i].indexOf(' -')))));
        }
        var newMeetingName;

function fixMeetingNames(meetingNamesRough) {
    var second = meetingNamesRough.substr(meetingNamesRough.indexOf('-') + 2);
    var first = meetingNamesRough.substr(0, meetingNamesRough.indexOf('-') - 1);
    

    if (first == second.toUpperCase()) {
        newMeetingName = first;
    } else if (second == "") {
        newMeetingName = first;
    } else {
        newMeetingName = second.toUpperCase();
    }
     return newMeetingName;
    }
});

// // Details:
// // ISSUE: printing a bunch of html junk
$('tbody').find('tr').each(function(i, elem){
        details.push($(elem).find('td')[1].text());
    });
    function fixDetails (text) {
    var t = text; 
    t = t.replace('\r', '');
    t = t.replace('\n', '');
    t = t.replace('\t', '');
    t = t.trim();
    return t; 
}
console.log(fixDetails(details));

// Meeting day:
// Function: will create associative array listing each weekday and all meeting times occuring on each day 
// Plus list meeting type & special interest
// function fixMeetingTimes (weekday) {
//     var newMeetingTime = weekday
// }
// $('tbody').find('tr').each(function(i, elem){
//     weekday.push($(elem).find('td').eq(1).html().split('<br />'));
//     });

console.log("Saved " + addresses.length + " addresses");
fs.writeFileSync('/home/ubuntu/workspace/data/meetingsArray.txt', JSON.stringify(addresses));

console.log("Saved " + locationNames.length + " location names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/locationNamesArray.txt', JSON.stringify(locationNames));

console.log("Saved " + meetingNames.length + " meeting names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/meetingNamesArray.txt', JSON.stringify(meetingNames));

console.log("Saved " + details.length + " meeting names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/detailsArray.txt', JSON.stringify(details));

// console.log(weekday);
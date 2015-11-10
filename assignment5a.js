// ---------------------------------
//
// weekly assignment 5a - Linnea Lapp
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

var meetingNames = [];
var cleanMeetingNames = [];
var locationNames = [];
var cleanLocationNames = [];
var addresses = [];
var cleanAddresses = [];
var details = [];
var cleanDetails = [];
var handicapAccess = [];
var cleanHandicapAccess = [];
var specialInterest = [];
var meetingDays = [];
var meetingTimes = [];
var meetingTypes = [];
var directions = [];

var $ = cheerio.load(content);

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem){
    // meeting names
    meetingNames.push($(elem).find('b').eq(0).text().replace(/\s+/g, '').trim());
    
    // cleanMeetingNames.push(fixMeetingNames(meetingNames[i]));
    
    // location names -- need to get rid of "\'"
    locationNames.push($(elem).find('h4').eq(0).text().trim());
    // cleanLocationNames.push(fixLocationNames(locationNames[i]));
    
    // addresses
    addresses.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    cleanAddresses.push(fixAddresses(addresses[i]));
    
    // special info -- need to get rid of "\'"
    details.push($(elem).find('.detailsBox').eq(0).text().trim());
    cleanDetails.push(boolean(details[i]));
    
    handicapAccess.push($(elem).find('span').eq(0).text().trim());
    cleanHandicapAccess.push(boolean(handicapAccess[i]));
    
});

console.log(cleanHandicapAccess);

// functions to clean data _____________________________________________________

// function fixMeetingNames(meetingNames) {
//     var second = meetingNames.substr(meetingNames.indexOf('-') + 2);
//     var first = meetingNames.substr(0, meetingNames.indexOf('-') - 1);
    

//     if (first == second.toUpperCase()) {
//         cleanMeetingNames = first;
//     } else if (second == "") {
//         cleanMeetingNames = first;
//     } else {
//         cleanMeetingNames = second.toUpperCase();
//     }
//      return cleanMeetingNames;
//     }

function fixAddresses(oldAddress) {
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress; 
}

function boolean(value) {
    if (value == "") {
        return "none";
    } else {
        return value;
    }
}

// function fixLocationNames (text) {
//     var t = text; 
//     t = t.replace('\', "");
//     return t; 
// }
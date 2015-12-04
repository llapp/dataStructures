// ------------------------------------------
//
// Final Project 1 -- pull lat/long data
//
// ------------------------------------------

var request = require('request');
var async = require('async');
var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var apiKey = 'AIzaSyD9LGffe6_uRk8GthCYa05bXaRejYsWQao'; //process.env.API_KEY;
var apiAddress = [];
var meetingsData = [];

var content = fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/allMeetingInfo.txt');

var $ = cheerio.load(content);



$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {
    apiAddress.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
});
    // console.log(apiAddress);
    
async.eachSeries(apiAddress, function(value, callback) {
    var myAddress = fixAddresses(value).split(' ').join('+');
    console.log(myAddress);
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + myAddress + '&key=' + apiKey;
    // var thisMeeting = new Object;
    // thisMeeting.address = value;
    var latLong;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(latLong);
    });
    setTimeout(callback, 2000);
}, function() {
            // console.log(meetingLatLongs);
    fs.writeFile('allLatLongs.txt', JSON.stringify(meetingsData), function (err) { 
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + meetingsData.length + ' entries to file');
        
    });
});  

function fixAddresses(oldAddress) {
    // want to get rid of anything in () before the comma
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    // console.log(newAddress);
    return newAddress; 
}
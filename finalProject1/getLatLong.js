// ------------------------------------------
//
// Final Project 1 -- pull lat/long data
//
// ------------------------------------------

var request = require('request');
var async = require('async');
var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var apiKey = process.env.API_KEY;
var apiAddress = [];
var latLong = [];

var content = fs.readFileSync('/home/ubuntu/workspace/data/finalProject1/allMeetingInfo.txt');

var $ = cheerio.load(content);



$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {
    apiAddress.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
});
    // console.log(apiAddress);

async.eachSeries(apiAddress, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value).split(' ').join('+') + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;

    request(apiRequest, function(err, resp, body) {
        if (err) {
            throw err;
        }
        
        if (JSON.parse(body).status == "ZERO_RESULTS") {
            console.log("ZERO RESULTS for" + value);
        } else {
            
            thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
            console.log(latLong.length);
        }

        // latLong.push(allInfo.meetingLatLong);

    setTimeout(callback, 300);
        
    }, function() {
    fs.writeFile('meetingLatLong.txt', JSON.stringify(latLong), function (err) {
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + latLong.length + ' entries to file ' + 'meetingLatLong.txt');
        
    });
});
});

function fixAddresses(oldAddress) {
    // want to get rid of anything in () before the comma
    var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
    // console.log(newAddress);
    return newAddress; 
}
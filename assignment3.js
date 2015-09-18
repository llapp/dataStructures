var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs  = require("fs");

var apiKey = process.env.API_KEY;

var meetingsData = [];
var addresses = [fs.readFileSync('/home/ubuntu/workspace/data/addresses.txt').toString().split('\n')];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
    });
    setTimeout(callback, 2000);
}, function() {
    console.log(meetingsData);
});
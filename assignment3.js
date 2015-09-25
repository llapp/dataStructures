var fs  = require("fs");
var request = require('request'); // npm install request
var async = require('async'); // npm install async

var apiKey = process.env.API_KEY;

var meetingsData = [];
var addresses = fs.readFileSync('/home/ubuntu/workspace/data/addresses.txt').toString();

// console.log(addresses);

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addresses + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        if(body.status === "ZERO_RESULTS") {
            console.log("ZERO RESULTS for" + thisMeeting.address);
        } else {
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
        }
    });
    setTimeout(callback, 300);
}, function() {
    fs.writeFile('assignment3_data.txt', meetingsData, function (err) {
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + meetingsData.length + 'entries to file ' + 'assignment3_data.txt');
        
    });
});
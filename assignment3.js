var fs  = require("fs");
var request = require('request'); // npm install request
var async = require('async'); // npm install async

// var apiKey = process.env.API_KEY;
var apiKey = process.env.API_KEY; //LINNEA, ADD YOUR API KEY HERE

var meetingsData = [];
// var addresses = fs.readFileSync('/home/ubuntu/workspace/data/addresses.txt').toString();
var addresses = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/addressArray.txt')); //AARON
var cleanedUp = [];
// console.log(addresses);

for (var i = 0; i < addresses.length; i++) {
    cleanedUp.push(((addresses[i].substring(0, addresses[i].indexOf(','))) + ', New York, NY').split(' ').join('+'));
}

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(cleanedUp, function(value, callback) {
    
    // var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addresses + '&key=' + apiKey;
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey; //AARON
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        // if(body.status === "ZERO_RESULTS") {
        if (JSON.parse(body).status == "ZERO_RESULTS") { //AARON
            console.log("ZERO RESULTS for" + value);
        } else {
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
        }
    });
    setTimeout(callback, 300);
}, function() {
    // fs.writeFile('assignment3_data.txt', meetingsData, function (err) {
    fs.writeFile('assignment3_data.txt', JSON.stringify(meetingsData), function (err) { //AARON
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + meetingsData.length + ' entries to file ' + 'assignment3_data.txt');
        
    });
});
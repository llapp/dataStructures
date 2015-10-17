var fs  = require("fs"); // npm install fs
var request = require('request'); // npm install request
var async = require('async'); // npm install async

var apiKey = process.env.API_KEY; 

var meetingsData = []; // make empty array for data results

// grab array of addresses from txt file
var addresses = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/addressArray.txt')); //AARON

// var cleanedUp = []; // make empty array for cleaned up addresses
// // clean up & format addresses to use in apiRequest
// for (var i = 0; i < addresses.length; i++) {
//     cleanedUp.push(((addresses[i].substring(0, addresses[i].indexOf(','))) + ', New York, NY').split(' ').join('+'));
// }

function fixAddresses(address) {
    var newAddress = address.substring(0, address.indexOf(',')) + ', New York, NY';
    return newAddress;
}

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    // if using function, replace 'value' with 'fixAddresses'
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value).split(' ').join('+') + '&key=' + apiKey; //AARON
    var thisMeeting = new Object;
    thisMeeting.address = fixAddresses(value);
    thisMeeting.originalAddress = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        if (JSON.parse(body).status != "ZERO_RESULTS") {
            thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        }
        else {console.log(apiRequest);}
        meetingsData.push(thisMeeting);
    });
    setTimeout(callback, 300);
}, function() {
    fs.writeFile('locationAddressArray.txt', JSON.stringify(meetingsData), function (err) { //AARON
        if (err) 
        return console.log('Error');
        console.log('Wrote ' + meetingsData.length + ' entries to file ' + 'locationAddressArray.txt');
        
    });
});
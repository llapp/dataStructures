var fs = require('fs');
var cheerio = require('cheerio'); // npm install cheerio

var content = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');
var addresses = [];
var locationNames = [];
var meetingNames = [];
var details = [];


var $ = cheerio.load(content);

// Meeting address:
$('tbody').find('tr').each(function(i, elem){
        addresses.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    });
    
// Location/building name:
// ISSUE: '&apos ;' printing in place of apostrophe
$('tbody').find('tr').each(function(i, elem){
        locationNames.push($(elem).find('h4').html());
    });

// Meeting name:
$('tbody').find('tr').each(function(i, elem){
    var meetingNamesRough = [];
        meetingNamesRough.push($(elem).find('b').html());
        for (var i = 0; i < meetingNamesRough.length; i++) {
            meetingNames.push(((meetingNamesRough[i].substring(0, meetingNamesRough[i].indexOf(' -')))));
        }
});

// Details:
// ISSUE: printing a bunch of html junk
$('tbody').find('tr').each(function(i, elem){
        details.push($(elem).find('div').attr('class', 'detailsBox').text());
    });


console.log("Saved " + addresses.length + " addresses");
fs.writeFileSync('/home/ubuntu/workspace/data/meetingsArray.txt', JSON.stringify(addresses));

console.log("Saved " + locationNames.length + " location names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/locationNamesArray.txt', JSON.stringify(locationNames));

console.log("Saved " + meetingNames.length + " meeting names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/meetingNamesArray.txt', JSON.stringify(meetingNames));

console.log("Saved " + details.length + " meeting names"); 
fs.writeFileSync('/home/ubuntu/workspace/data/detailsArray.txt', JSON.stringify(details));

// console.log(details);
var fs = require('fs');
var cheerio = require('cheerio');

var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

var $ = cheerio.load(fileContent);

var meetings = [];
var addresses = [];

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {
    meetings.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    
});

fs.writeFileSync('/home/ubuntu/workspace/data/addressArray.txt', JSON.stringify(meetings)); //AARON

// for (var i = 0; i < meetings.length; i++) {
//     addresses.push(((meetings[i].substring(0, meetings[i].indexOf(','))) + ', New York, NY').split(' ').join('+'));
// }


// fs.writeFile('addresses.txt', addresses, function (err) {
//   if (err) 
//   return console.log('Error');
//   console.log('File written');
// });
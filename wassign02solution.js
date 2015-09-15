var fs = require('fs');
var cheerio = require('cheerio');

var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

var $ = cheerio.load(fileContent);

var meetings = [];

$('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {
    meetings.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
    
});

console.log(meetings);

// .eq(i) use to select matched element at a specified index 
// in this case we want the third element
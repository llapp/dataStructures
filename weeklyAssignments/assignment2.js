var fs = require('fs');
var cheerio = require('cheerio');

var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

var $ = cheerio.load(fileContent);

$('table').each(function(i, elem){
    if ($(elem).attr("cellpadding") == '5') {
       $(elem).find('td:first-child').children().remove().end().text().split("\\n");
       
       var address = location[0];
       
       console.log(address.trim());
          }
    }
);

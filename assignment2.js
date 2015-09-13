var fs = require('fs');
var cheerio = require('cheerio');

var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

var $ = cheerio.load(fileContent);

// // declare streetAddress variable globally
// var streetAddress = ("");

// // use .attr method to target the specific table
// $('table').attr('cellpadding', '5') {
//     // target the h4 tags in the table
//     $('h4').each(function(i, elem){
//         // each street address is the next, next element after each h4
//         var meetingName = $(elem).next().each(function(i, elem2) {
//             var streetAddress = $(elem2).next().each(function(i, elem3) {
//               return ($(elem3).text());
//           });
//         });
//     });
// }

// // print the trimmed street address
// console.log(streetAddress.trim());

// START HERE: 
$('table').each(function(i, elem){
    if ($(elem).attr("cellpadding") == '5') {
        $(elem).find('h4').nextUntil('br').siblings().each(function(i, elem2) {
              console.log($(elem2).text());
          });
    }
});


//continue traversing the table down to the <td> elements that contain the address data
            //console.log the addresses here for EACH <td> that you have selected in the line above
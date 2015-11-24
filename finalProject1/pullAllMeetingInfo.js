var request = require('request');
var fs = require('fs');

request('http://www.nyintergroup.org/meetinglist/meetinglist.cfm?searchstr=&Search=Search&borough=M&zone=Zone&zipcode=Zip+Code&day=&StartTime=&EndTime=&meetingtype=&SpecialInterest=', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    fs.writeFileSync('/home/ubuntu/workspace/data/finalProject1/allMeetingInfo.txt', body);
  }
  else {console.error('request failed')}
});

// also had to mkdir data to have a place to send the text file to
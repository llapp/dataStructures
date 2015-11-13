// ---------------------------------
// weekly assignment 10a - Linnea Lapp
// 11-16-2015
// ---------------------------------

var pg = require('pg');

var conString = "postgres://llapp:edmontonab@data-structures.cofujylv8rqe.us-west-2.rds.amazonaws.com:5432/postgres";

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  // Assuming a button is attached to pin 9
  this.pinMode(9, five.Pin.INPUT);
  this.digitalRead(9, function(value) {
    // console.log(value);

        pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      client.query("INSERT INTO sensorData VALUES (DEFAULT, DEFAULT, '0');", function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
    });

  });
  });
});
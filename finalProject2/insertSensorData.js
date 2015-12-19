
var pg = require('pg');

var conString = "postgres://llapp:edmontonab@data-structures.cofujylv8rqe.us-west-2.rds.amazonaws.com:5432/postgres";

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  this.pinMode(9, five.Pin.INPUT);
  // this.digitalRead(9, function(value) {

  var sensor = new five.Sensor.Digital(9);
  sensor.on("change", function() {

    // console.log(this.value);
if (this.value == 1) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
    }

  // -------------------------- INSERT VALUE WHEN APART -------------------------

        client.query("INSERT INTO laptopData VALUES (DEFAULT, '1');", function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
      });

  // -------------------------- INSERT VALUE WHEN TOGETHER -------------------------
    });
    } 

    else {

      pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
        client.query("INSERT INTO laptopData VALUES (DEFAULT, '0');", function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
      });
    });
  }
  // -------------------------- INSERT FINISHED ----------------------------------
    });

  });



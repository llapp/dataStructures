var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  // Assuming a button is attached to pin 9
  this.pinMode(9, five.Pin.INPUT);
  this.digitalRead(9, function(value) {
    console.log(value);
  });
});